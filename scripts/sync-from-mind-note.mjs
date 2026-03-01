import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const repoRoot = process.cwd();
const defaultManifestPath = path.join(repoRoot, '.template-sync', 'sync-manifest.json');
const defaultStatePath = path.join(repoRoot, '.template-sync', 'state.json');

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  return {
    plan: flags.has('--plan'),
    apply: flags.has('--apply'),
    writeBaseline: flags.has('--write-baseline'),
    verify: flags.has('--verify'),
    syncPresetVersion: !flags.has('--no-sync-preset-version'),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function tryGitHead(cwd) {
  try {
    return execFileSync('git', ['-C', cwd, 'rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function ensureExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} 不存在: ${filePath}`);
  }
}

function copyFile(sourceFile, targetFile) {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.copyFileSync(sourceFile, targetFile);
}

function syncAutoCopy(manifest) {
  const results = [];
  const sourceRoots = {
    website: manifest.source.websitePath,
    preset: manifest.source.presetPackagePath,
  };

  for (const item of manifest.autoCopy ?? []) {
    if (item.enabled === false) {
      results.push({ ...item, status: 'skipped-disabled' });
      continue;
    }
    const sourceRoot = sourceRoots[item.source];
    if (!sourceRoot) {
      results.push({ ...item, status: 'skipped-unknown-source' });
      continue;
    }
    const sourceFile = path.join(sourceRoot, item.from);
    const targetFile = path.join(repoRoot, item.to);
    ensureExists(sourceFile, '源文件');
    copyFile(sourceFile, targetFile);
    results.push({ ...item, status: 'copied' });
  }

  return results;
}

function syncPresetVersion(manifest) {
  const cfg = manifest.presetVersionSync;
  if (!cfg?.enabled) {
    return { status: 'disabled' };
  }

  const sourcePkgPath = path.join(manifest.source.presetPackagePath, 'package.json');
  const targetPkgPath = path.join(repoRoot, 'package.json');
  ensureExists(sourcePkgPath, 'preset package.json');
  ensureExists(targetPkgPath, '模板 package.json');

  const sourcePkg = readJson(sourcePkgPath);
  const targetPkg = readJson(targetPkgPath);
  const depName = cfg.targetDependencyName;
  const nextVersion = sourcePkg.version;
  const currentVersion = targetPkg.dependencies?.[depName] ?? null;

  if (!targetPkg.dependencies || !Object.prototype.hasOwnProperty.call(targetPkg.dependencies, depName)) {
    return {
      status: 'missing-target-dependency',
      dependency: depName,
      sourceVersion: nextVersion,
      currentVersion,
    };
  }

  const normalizedNext = nextVersion ? `^${nextVersion}` : null;
  if (!normalizedNext) {
    return { status: 'invalid-source-version', dependency: depName };
  }

  if (currentVersion === normalizedNext) {
    return {
      status: 'unchanged',
      dependency: depName,
      currentVersion,
      nextVersion: normalizedNext,
    };
  }

  targetPkg.dependencies[depName] = normalizedNext;
  writeJson(targetPkgPath, targetPkg);
  return {
    status: 'updated',
    dependency: depName,
    currentVersion,
    nextVersion: normalizedNext,
  };
}

function formatResults(autoCopyResults, presetResult) {
  console.log('\n[auto-copy]');
  for (const item of autoCopyResults) {
    console.log(
      `- ${item.status.padEnd(22)} ${item.source}:${item.from} -> ${item.to}${item.note ? ` (${item.note})` : ''}`,
    );
  }

  console.log('\n[preset-version]');
  console.log(`- ${presetResult.status}`);
  if (presetResult.dependency) {
    console.log(`  dependency: ${presetResult.dependency}`);
  }
  if (presetResult.currentVersion !== undefined) {
    console.log(`  current: ${presetResult.currentVersion}`);
  }
  if (presetResult.nextVersion !== undefined) {
    console.log(`  next: ${presetResult.nextVersion}`);
  }
  if (presetResult.sourceVersion !== undefined) {
    console.log(`  sourceVersion: ${presetResult.sourceVersion}`);
  }
}

function printManualChecklist(manifest) {
  console.log('\n[manual-review-checklist]');
  for (const [scope, prefixes] of Object.entries(manifest.manualReviewPrefixes ?? {})) {
    console.log(`- ${scope}`);
    for (const p of prefixes) {
      console.log(`  - ${p}`);
    }
  }
}

function printHeads(manifest, state) {
  const currentWebsiteCommit = tryGitHead(manifest.source.websitePath);
  const currentPresetCommit = tryGitHead(manifest.source.presetPackagePath);
  console.log('\n[source-head]');
  console.log(`- website: ${currentWebsiteCommit ?? 'N/A'}`);
  console.log(`- preset : ${currentPresetCommit ?? 'N/A'}`);
  console.log('\n[last-sync]');
  console.log(`- website: ${state.lastSync?.websiteCommit ?? 'N/A'}`);
  console.log(`- preset : ${state.lastSync?.presetCommit ?? 'N/A'}`);
  return { currentWebsiteCommit, currentPresetCommit };
}

function writeBaseline(statePath, state, heads) {
  const next = {
    ...state,
    lastSync: {
      websiteCommit: heads.currentWebsiteCommit,
      presetCommit: heads.currentPresetCommit,
    },
    updatedAt: new Date().toISOString(),
  };
  writeJson(statePath, next);
  console.log(`\n[baseline] 已更新: ${statePath}`);
}

function runVerifyCommands(manifest) {
  const commands = manifest.verifyCommands ?? [];
  if (commands.length === 0) {
    console.log('\n[verify] manifest 未配置 verifyCommands，跳过');
    return;
  }
  console.log('\n[verify] 开始执行校验命令');
  for (const command of commands) {
    console.log(`- ${command}`);
    execFileSync('sh', ['-lc', command], { cwd: repoRoot, stdio: 'inherit' });
  }
}

function main() {
  const args = parseArgs(process.argv);
  const hasAction = args.plan || args.apply || args.writeBaseline;
  const manifest = readJson(defaultManifestPath);
  const state = readJson(defaultStatePath);

  console.log(`[manifest] ${defaultManifestPath}`);
  console.log(`[state] ${defaultStatePath}`);
  const heads = printHeads(manifest, state);
  printManualChecklist(manifest);

  if (!hasAction || args.plan) {
    console.log('\n[plan] 预览模式，不修改文件。使用 --apply 执行同步。');
  }

  if (args.apply) {
    const autoCopyResults = syncAutoCopy(manifest);
    const presetResult = args.syncPresetVersion ? syncPresetVersion(manifest) : { status: 'skipped-by-flag' };
    formatResults(autoCopyResults, presetResult);
    console.log('\n[next] 建议执行: npm run verify:template');
    if (args.verify) {
      runVerifyCommands(manifest);
    }
  }

  if (args.writeBaseline) {
    writeBaseline(defaultStatePath, state, heads);
  }
}

try {
  main();
} catch (error) {
  console.error(`\n[error] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

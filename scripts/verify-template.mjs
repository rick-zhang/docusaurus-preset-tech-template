import { execFileSync } from 'node:child_process';
import process from 'node:process';

const repoRoot = process.cwd();
const argv = new Set(process.argv.slice(2));

const tasks = [
  { name: 'typecheck', command: 'npm run typecheck' },
  { name: 'build', command: 'npm run build' },
].filter((task) => !(argv.has('--skip-build') && task.name === 'build'));

if (tasks.length === 0) {
  console.log('[verify-template] 没有需要执行的任务');
  process.exit(0);
}

console.log(`[verify-template] cwd=${repoRoot}`);
for (const task of tasks) {
  console.log(`\n[verify-template] ${task.name}: ${task.command}`);
  execFileSync('sh', ['-lc', task.command], { cwd: repoRoot, stdio: 'inherit' });
}

console.log('\n[verify-template] 完成');

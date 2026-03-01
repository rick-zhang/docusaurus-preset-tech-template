---
name: mind-note-template-sync
description: 同步当前 Docusaurus 模板仓库与上游 `mind-note/website` 及 `packages/docusaurus-preset-tech` 的工程级流程。适用于生成同步计划、执行模板层文件同步、同步 preset 包版本、运行 typecheck/build 校验、更新同步基线记录。
---

# Mind Note Template Sync

用于当前仓库（`docusaurus-preset-tech-template`）的工程级同步流程。

## 何时使用

- 用户要求“同步模板仓库与 `mind-note` 上游改动”
- 用户要求“回灌 `website` 的模板层改动”
- 用户要求“更新 preset 版本并校验模板可构建”

## 核心原则

- `packages/docusaurus-preset-tech` 的功能更新优先通过 **同步 npm 依赖版本** 传播，不复制源码。
- `mind-note/website` 只做 **模板层选择性同步**，禁止全量覆盖。
- 同步后必须执行校验（至少 `typecheck`，建议 `build`）。
- 校验通过后再更新同步基线。

## 工作流（默认顺序）

1. 查看同步计划（不改文件）
2. 执行同步（自动复制 + preset 版本同步）
3. 运行构建校验
4. 写入新的基线提交记录

## 关键文件

- 运行配置：`.template-sync/sync-manifest.json`
- 同步基线：`.template-sync/state.json`
- 同步脚本：`scripts/sync-from-mind-note.mjs`
- 校验脚本：`scripts/verify-template.mjs`

## 常用命令

```bash
npm run sync:mind-note:plan
npm run sync:mind-note:apply
npm run verify:template
npm run sync:mind-note:baseline
```

如需一次性执行并校验：

```bash
npm run sync:mind-note:apply:verify
```

## 需要人工确认的高风险变更

优先参考 `references/manual-review-rules.md`：

- `website/package.json`
- `website/docusaurus.config.ts`
- `website/sidebars.ts`
- `website/src/theme/**`
- `website/src/components/**`
- `preset` 的源码结构调整（插件注册、theme swizzle 入口、构建脚本）

## 参考资料（按需读取）

- 路径映射与同步边界：`references/path-map.md`
- 人工审查规则：`references/manual-review-rules.md`

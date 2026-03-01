# Manual Review Rules

## 必须人工审查

- `website/package.json`
  - 依赖新增/删除可能影响构建与运行时
- `website/docusaurus.config.ts`
  - 插件、preset 配置、导航、i18n、构建行为容易带入源站点私有配置
- `website/sidebars.ts`
  - 容易与模板默认文档结构冲突
- `website/src/theme/**`
  - 与 preset 的主题扩展可能重叠，需确认覆盖关系
- `website/src/components/**`
  - 组件依赖链复杂，可能引入额外依赖

## 可自动同步但仍建议复查

- `src/pages/index.tsx`
- `src/pages/styles.module.css`
- `postcss.config.js`
- `static/manifest.json`

## 同步完成后的校验顺序

1. `npm run typecheck`
2. `npm run build`
3. 通过后写入 `.template-sync/state.json`

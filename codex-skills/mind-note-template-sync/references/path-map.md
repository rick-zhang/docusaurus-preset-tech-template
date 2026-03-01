# Path Map

## 同步边界

- 上游 1：`mind-note/website`
- 上游 2：`mind-note/packages/docusaurus-preset-tech`
- 下游：当前模板仓库根目录

## 推荐策略

- `preset`：同步 `package.json` 中 `@rick-zhang/docusaurus-preset-tech` 版本号
- `website`：仅同步模板通用文件（由 `.template-sync/sync-manifest.json` 中 `autoCopy` 控制）

## 不建议自动覆盖

- 站点内容（`docs/`、`blog/`）
- 项目专用脚本（`scripts/`）
- 复杂主题覆写（`src/theme/`）
- 大量业务组件和数据文件（`src/components/`、`src/data/`）

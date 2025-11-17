# docusaurus-preset-tech-template

这是一个使用 [Docusaurus](https://docusaurus.io/) 和 [@rick-zhang/docusaurus-preset-tech](https://github.com/rick-zhang/docusaurus-preset-tech) 预设包的模板仓库。

## 快速开始

使用 `create-docusaurus` 脚手架工具快速创建新项目：

```bash
npx create-docusaurus@3.9.2 my-website \
  https://github.com/rick-zhang/docusaurus-preset-tech-template.git \
  --typescript
```

## 手动安装

如果你想手动使用这个模板：

1. 克隆或下载这个仓库
2. 安装依赖：

```bash
yarn install
# 或
npm install
```

3. 启动开发服务器：

```bash
yarn start
# 或
npm start
```

4. 构建生产版本：

```bash
yarn build
# 或
npm run build
```

## 配置说明

### 基本配置

编辑以下文件来自定义你的站点：

- `docusaurus.config.ts` - Docusaurus 主配置文件
- `sidebars.ts` - 文档侧边栏配置
- `package.json` - 项目依赖和脚本

### 重要配置项

在 `docusaurus.config.ts` 中，请修改以下配置：

- `title` - 站点标题
- `tagline` - 站点标语
- `organizationName` - 组织名称
- `projectName` - 项目名称
- `url` - 站点 URL
- `editUrl` - 编辑页面链接的 URL

### 文档和博客

- `docs/` - 文档目录
- `blog/` - 博客目录

## 特性

这个模板基于 `@rick-zhang/docusaurus-preset-tech` 预设包，包含以下特性：

- ✅ 20+ 自定义组件
- ✅ 完整样式系统
- ✅ 数学公式支持（KaTeX）
- ✅ 思维导图集成
- ✅ TypeScript 支持
- ✅ 明暗主题切换
- ✅ 响应式设计

## 更多信息

- [Docusaurus 文档](https://docusaurus.io/docs)
- [docusaurus-preset-tech 文档](https://github.com/rick-zhang/docusaurus-preset-tech)

## 许可证

MIT

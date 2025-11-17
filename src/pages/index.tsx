/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

function HeroBanner() {
  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroProjectTagline}>
          <img
            alt="My Site Logo"
            className={styles.heroLogo}
            src={useBaseUrl('/img/logo.svg')}
            width="200"
            height="200"
          />
          <span className={styles.heroTitleTextHtml}>
            <b>欢迎</b> 来到我的文档站点<br />
            使用 Docusaurus 和 docusaurus-preset-tech 构建
          </span>
        </Heading>
      </div>
    </div>
  );
}

type Feature = {
  title: string;
  icon: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    title: '丰富的组件库',
    icon: '🧩',
    description: '20+ 自定义组件，包括思维导图、API 表格、代码演示等，提升文档表现力',
  },
  {
    title: 'MDX 驱动',
    icon: '📝',
    description: '使用 MDX 编写文档，支持在 Markdown 中嵌入 React 组件，灵活强大',
  },
  {
    title: '数学公式支持',
    icon: '🔢',
    description: '内置 KaTeX 支持，完美渲染 LaTeX 数学公式，适合技术文档',
  },
  {
    title: '明暗主题',
    icon: '🌓',
    description: '优雅的明暗主题切换，青色系配色，保护视力的同时提供最佳阅读体验',
  },
  {
    title: '全文搜索',
    icon: '🔍',
    description: '强大的搜索功能，快速定位所需内容，提高学习效率',
  },
  {
    title: '响应式设计',
    icon: '📱',
    description: '完美适配桌面端和移动端，随时随地查阅笔记',
  },
];

function FeaturesSection() {
  return (
    <div className={clsx(styles.section)}>
      <div className="container">
        <div className="row">
          {FEATURES.map((feature, idx) => (
            <div className="col col--4" key={idx} style={{marginBottom: '1.5rem'}}>
              <div className="text--center padding-horiz--md">
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>
                  {feature.icon}
                </div>
                <Heading as="h3" style={{fontSize: '1.25rem'}}>
                  {feature.title}
                </Heading>
                <p style={{color: 'var(--ifm-color-emphasis-700)'}}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PresetSection() {
  return (
    <div className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className="row">
          <div className="col col--6" style={{display: 'flex', alignItems: 'center'}}>
            <div>
              <Heading as="h2" style={{marginBottom: '1rem'}}>
                🚀 基于自定义预设包构建
              </Heading>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>
                本站使用 <code>@rick-zhang/docusaurus-preset-tech</code> 预设包构建，
                这是一个增强的 Docusaurus 预设，包含丰富的自定义组件、样式和插件。
              </p>
              <div style={{marginTop: '1.5rem'}}>
                <Link 
                  className="button button--primary button--lg"
                  to="/docs/intro"
                >
                  开始使用
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div style={{
              padding: '2rem',
              backgroundColor: 'var(--ifm-code-background)',
              borderRadius: '8px',
              fontFamily: 'var(--ifm-font-family-monospace)',
            }}>
              <div style={{marginBottom: '1rem', color: 'var(--ifm-color-success)'}}>
                # 安装预设包
              </div>
              <div style={{marginBottom: '1rem'}}>
                <code>yarn add @rick-zhang/docusaurus-preset-tech</code>
              </div>
              <div style={{marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--ifm-color-success)'}}>
                # 特性
              </div>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li>✅ 20+ 自定义组件</li>
                <li>✅ 完整样式系统</li>
                <li>✅ 数学公式支持</li>
                <li>✅ 思维导图集成</li>
                <li>✅ TypeScript 支持</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const {tagline} = siteConfig;
  
  return (
    <Layout title="首页" description={tagline}>
      <main>
        <HeroBanner />
        <FeaturesSection />
        <PresetSection />
      </main>
    </Layout>
  );
}


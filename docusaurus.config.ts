import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Moondream Docs',
  tagline: 'Documentation for Moondream',
  favicon: 'img/md_logo.svg',

  clientModules: [require.resolve('./src/theme-sync.ts')],

  future: {
    v4: true,
  },

  url: 'https://docs.moondream.ai',
  baseUrl: '/',

  organizationName: 'm87-labs',
  projectName: 'md-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/m87-labs/md-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Moondream',
      logo: {
        alt: 'Moondream Logo',
        src: 'img/md_logo.svg',
        href: 'https://moondream.ai',
        target: '_self',
        width: 32,
        height: 32,
      },
      items: [
        {
          href: 'https://moondream.ai/c/playground',
          label: 'Playground',
          position: 'left',
          target: '_self',
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://moondream.ai/blog',
          label: 'Blog',
          position: 'left',
          target: '_self',
        },
        {
          href: 'https://moondream.ai/pricing',
          label: 'Pricing',
          position: 'left',
          target: '_self',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'shell-session', 'json', 'python', 'javascript', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        indexBlog: false,
        indexDocs: true,
        indexPages: false,
        docsRouteBasePath: '/',
        docsDir: ['docs'],
      }),
    ],
  ],
};

export default config;

import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "netkela",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ru-RU",
    baseUrl: "netkela.ru",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "IBM Plex Mono",
      },
colors: {
  lightMode: {
    light: "#ffffff",        // оставляем белый фон
    lightgray: "#f0f0f2",    // более мягкий серый для границ
    gray: "#6b7280",         // современный средний серый
    darkgray: "#374151",     // глубокий серый для текста
    dark: "#111827",         // почти черный
    secondary: "#3246e3",    // королевский синий (ваш цвет)
    tertiary: "#10b981",     // изумрудный зеленый
    highlight: "rgba(50, 70, 227, 0.1)",  // подсветка на основе #3246e3
    textHighlight: "#fbbf2488",  // янтарная подсветка текста
  },
  darkMode: {
    light: "#161618",        // оставляем темный фон
    lightgray: "#27272a",    // мягкий темно-серый
    gray: "#71717a",         // нейтральный серый
    darkgray: "#e4e4e7",     // светло-серый для текста
    dark: "#fafafa",         // почти белый
    secondary: "#5b6ff5",    // более светлый вариант #3246e3 для темной темы
    tertiary: "#34d399",     // светло-изумрудный
    highlight: "rgba(91, 111, 245, 0.15)",  // подсветка на основе светлого варианта
    textHighlight: "#fbbf2455",  // янтарная подсветка текста
  },
},

    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config

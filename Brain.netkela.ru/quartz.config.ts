import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Brain Netkela",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ru-RU",
    baseUrl: "brain.netkela.ru",
    
    // Убрали "Private" - она и так отсечена гитом.
    // Оставляем ".obsidian", чтобы настройки не лезли в сборку.
    ignorePatterns: [".obsidian"], 
    
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
          light: "#ffffff",
          lightgray: "#f0f0f2",
          gray: "#6b7280",
          darkgray: "#374151",
          dark: "#111827",
          secondary: "#3246e3",
          tertiary: "#84a59d",
          highlight: "rgba(50, 70, 227, 0.1)",
          textHighlight: "#fbbf2488",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#27272a",
          gray: "#71717a",
          darkgray: "#e4e4e7",
          dark: "#fafafa",
          secondary: "#5b6ff5",
          tertiary: "#84a59d",
          highlight: "rgba(91, 111, 245, 0.15)",
          textHighlight: "#fbbf2455",
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
    filters: [
      // ВЕРНУЛИ RemoveDrafts
      // Теперь всё публикуется автоматически.
      // Чтобы скрыть файл, напиши в свойствах: draft: true
      Plugin.RemoveDrafts(),
    ],
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
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Netkela",
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
    gray: "#6b7280",         // современный средний серый (Tailwind gray-500)
    darkgray: "#374151",     // глубокий серый для текста (Tailwind gray-700)
    dark: "#111827",         // почти черный (Tailwind gray-900)
    secondary: "#3b82f6",    // яркий синий (Tailwind blue-500)
    tertiary: "#10b981",     // изумрудный зеленый (Tailwind emerald-500)
    highlight: "rgba(59, 130, 246, 0.1)",  // голубоватая подсветка
    textHighlight: "#fbbf2488",  // янтарная подсветка текста
  },
  darkMode: {
    light: "#161618",        // оставляем темный фон
    lightgray: "#27272a",    // мягкий темно-серый (Tailwind zinc-800)
    gray: "#71717a",         // нейтральный серый (Tailwind zinc-500)
    darkgray: "#e4e4e7",     // светло-серый для текста (Tailwind zinc-200)
    dark: "#fafafa",         // почти белый (Tailwind zinc-50)
    secondary: "#60a5fa",    // светло-синий (Tailwind blue-400)
    tertiary: "#34d399",     // светло-изумрудный (Tailwind emerald-400)
    highlight: "rgba(96, 165, 250, 0.15)",  // голубоватая подсветка
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

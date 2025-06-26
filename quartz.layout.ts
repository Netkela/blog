import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.TagList(),
    Component.Backlinks(),
    Component.Graph(),
    Component.TelegramComments({
      website: "s-0koNjl", // ваш ID сайта
      limit: 5,
      pageIdEnabled: true,
      // дополнительные параметры при необходимости
      // color: "E22F38",
      // dislikes: "1",
      // outlined: "1",
      // colorful: "1"
    }),
  ],
  footer: Component.Footer({
    links: {
      Telegram: "https://t.me/netkela",
      VK: "https://vk.com/netkela",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
            // === ИЗМЕНЕНИЕ ЗДЕСЬ ===
      component: Component.Breadcrumbs({
        showCurrentPage: false, // <-- Добавьте эту строку
        // spacerSymbol: "→", // Можете также настроить разделитель, если хотите
        // rootName: "Домой",  // И имя корневого элемента
      }),


      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        /* { Component: Component.ReaderMode() }, */
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    // --- НАЧАЛО ИЗМЕНЕНИЙ В HEADER ---
    Component.PageTitle(), // Заголовок сайта слева
    Component.Flex({ // Flex-контейнер для остальных элементов
      components: [
        {
          Component: Component.Search(), // Поиск, который будет растягиваться
          grow: true,
        },
        { Component: Component.Darkmode() }, // Переключатель тем справа
        { Component: Component.ReaderMode() }, // Фокус чтения справа
      ],
    }),
    // --- КОНЕЦ ИЗМЕНЕНИЙ В HEADER ---
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      Telegram: "https://t.me/netkelago",
      VK: "https://vk.com/netkela",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph(),
    Component.Backlinks(),
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

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.TagList(),
      Component.FixedBio({
      name: "Ваше ФИО", // <--- ОБЯЗАТЕЛЬНО: Вставьте ваше ФИО
      bio: "Я - опытный веб-разработчик, специализирующийся на фронтенде и бэкенде, с глубоким пониманием SEO и оптимизации производительности. Увлечен созданием чистых, масштабируемых и удобных для пользователя решений.", // <--- ОБЯЗАТЕЛЬНО: Вставьте ваше описание
      social: {
        github: "https://github.com/ваш_логин", // Опционально
        linkedin: "https://linkedin.com/in/ваш_логин", // Опционально
        twitter: "https://twitter.com/ваш_логин" // Опционально
      },
      title: "Обо мне" // Опционально: можно настроить заголовок секции
    }), // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
    Component.Backlinks(),
    Component.Graph(),
    Component.TelegramComments({
      website: "Poy1WQpK", // ваш ID сайта
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
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.TagList(),
      Component.FixedBio({
      name: "Александр Овсянников (Netkela)", // <--- ОБЯЗАТЕЛЬНО: Вставьте ваше ФИО
      bio: "SEO-специалист и вебмастер с опытом более 16 лет. Прошел путь от киберспортсмена до создателя успешных интернет-проектов. Сейчас активно развиваю онлайн-сообщество для онлайн-предпринимателей и специалистов.", // <--- ОБЯЗАТЕЛЬНО: Вставьте ваше описание
      avatarSrc: "/files/site/avatar.jpg",
      social: {
        telegram: "https://t.me/netkela", // Опционально
        vk: "https://vk.com/netkela", // Опционально
        email: "mailto:netkela@mail.ru" // Опционально
      },
      title: "Обо мне" // Опционально: можно настроить заголовок секции
    }), // <--- ДОБАВЬТЕ ЭТУ СТРОКУ
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
    TelegramWidget({
  defaultChannel: "netkelago",  // канал по умолчанию
  defaultLimit: 5,                 // лимит комментариев
  darkMode: "auto"                 // авто-переключение тёмной темы
})
    Component.YandexMetrika({
      counterId: "95070723",
      enableClickmap: true,
      enableTrackLinks: true,
      enableAccurateTrackBounce: true,
      enableWebvisor: true
    })
  ],
  footer: Component.Footer({
    links: {
      Блог: "/blog/",
      Статьи: "/articles/",
      Услуги: "/uslugi/",
      "Обо мне": "/about",
      Контакты: "/contacts",
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
    Component.Backlinks(),
    Component.Graph(),
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
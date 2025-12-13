import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.TagList(),
    Component.TelegramSubscribe({
      channelUrl: "https://t.me/netkela",
      buttonText: "Подписаться на Telegram",
      description: "Более 16 лет в онлайн-бизнесе. Честно о заработке и продуктивности. Строю проекты без хайпа и мутных схем."
    }),
      Component.FixedBio({
      name: "Александр Овсянников (Netkela)",
      bio: 'Предприниматель и блогер. Основатель <a href="https://webmasterie.ru/club" target="_blank" rel="noopener">сообщества Вебмастерье</a> и автор телеграм канала <a href="https://t.me/netkelago" target="_blank" rel="noopener">Netkela не промахнулся</a>.',
      avatarSrc: "/files/site/avatar.jpg",
      social: {
        telegram: "https://t.me/netkela",
        vk: "https://vk.com/netkela",
        email: "mailto:netkela@mail.ru"
      },
      title: "Обо мне"
    }), 
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
    Component.TelegramWidget({
      channel: "netkelago",   // имя вашего канала без @
      limit: 10               // опционально: сколько комментариев показать
    }),
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
    Component.CustomMenu({
      title: "Навигация",
      items: [
        { title: "Блог", href: "/notes/" },
        { title: "Обо мне", href: "/about" },
        { title: "Контакты", href: "/contacts" },
      ],
    })
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
    Component.CustomMenu({
      title: "Навигация",
      items: [
        { title: "Блог", href: "/blog/" },
        { title: "Обо мне", href: "/about" },
        { title: "Контакты", href: "/contacts" },
      ],
    })
  ],
  right: [],
}
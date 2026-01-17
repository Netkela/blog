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
      bio: '16 лет в интернет-бизнесе. Успешно продал десятки проектов. Делюсь опытом и исследую мир онлайн-заработка.',
      avatarSrc: "/files/site/avatar.jpg",
      social: {
        telegram: "https://t.me/alexnetkela",
        vk: "https://vk.com/alexnetkela",
        email: "mailto:netkela@mail.ru"
      },
      title: "Обо мне"
    }), 
    Component.TelegramComments({
      website: "Poy1WQpK",
      limit: 5,
      pageIdEnabled: true,
    }),
    Component.TelegramWidget({
      channel: "netkela",
      limit: 10
    }),
    Component.YandexMetrika({
      counterId: "106270513",
      enableClickmap: true,
      enableTrackLinks: true,
      enableAccurateTrackBounce: true,
      enableWebvisor: true
    })
  ],
  footer: Component.Footer({
    links: {
      "Обо мне": "https://netkela.ru/author/netkela",
      Контакты: "/contacts",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        showCurrentPage: false,
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

// components for pages that display lists of pages (e.g. tags or folders)
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

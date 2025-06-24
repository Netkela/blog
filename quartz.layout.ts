import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// --- НОВЫЙ КОМПОНЕНТ ДЛЯ МЕНЮ ---
// Это простой пример, вы можете создать более сложный компонент меню, если нужно
const CustomMenu = () => (
  <Component.Flex
    components={[
      { Component: () => <a href="/">Главная</a> },
      { Component: () => <a href="/tags">Теги</a> },
      { Component: () => <a href="/about">О проекте</a> },
      // Добавьте больше ссылок по мере необходимости
    ]}
    // Вы можете добавить CSS-класс для стилизации меню, например, gap: "1rem"
    // style={{ gap: "2rem" }} // Пример: расстояние между пунктами меню
  />
)
// --- КОНЕЦ НОВОГО КОМПОНЕНТА ---

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Flex({
      components: [
        // Левая секция: Логотип/Заголовок сайта
        {
          Component: Component.PageTitle(),
          // grow: true, // Не используем grow здесь, чтобы он занимал только нужное место
        },

        // Центральная секция: Меню
        {
          Component: CustomMenu, // Наш новый компонент меню
          grow: true, // Позволяем меню занять оставшееся пространство между левой и правой секциями
          // alignSelf: "center", // Выравниваем по центру по вертикали (если шапка высокая)
          justifyContent: "center", // Выравниваем содержимое меню по центру по горизонтали
        },

        // Правая секция: Поиск, переключение режимов
        {
          Component: Component.Flex({
            components: [
              {
                Component: Component.Search(),
                // grow: true, // Не используем grow здесь, чтобы поиск не растягивался на всю правую секцию
              },
              { Component: Component.Darkmode() },
              { Component: Component.ReaderMode() },
            ],
            // gap: "0.5rem", // Пример: расстояние между элементами в правой секции
          }),
          // grow: true, // Не используем grow здесь, чтобы правая секция занимала только нужное место
          justifyContent: "flex-end", // Прижимаем элементы правой секции к правому краю
        },
      ],
      // Дополнительные стили для основного Flex-контейнера шапки
      // gap: "1rem", // Расстояние между тремя основными секциями (левая, центральная, правая)
      // alignItems: "center", // Выравниваем элементы по центру по вертикали
    }),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
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
    Component.Explorer(), // Explorer остается в левой боковой панели
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer(), // Explorer остается в левой боковой панели
  ],
  right: [],
}

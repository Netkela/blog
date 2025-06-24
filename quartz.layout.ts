import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// --- НОВЫЙ КОМПОНЕНТ ДЛЯ МЕНЮ ---
// Это простой пример, вы можете создать более сложный компонент меню, если нужно
const CustomMenu = () => (
  <Component.Flex
    components={[
      // Правильно: передаем анонимные функции, которые возвращают JSX
      { Component: () => <a href="/">Главная</a> },
      { Component: () => <a href="/tags">Теги</a> },
      { Component: () => <a href="/about">О проекте</a> },
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
    // --- ИСПРАВЛЕНИЕ: ПЕРЕДАЕМ КОМПОНЕНТЫ, А НЕ ИХ ВЫЗОВЫ ---
    Component.Flex({
      components: [
        // Левая секция: Логотип/Заголовок сайта
        // ИСПРАВЛЕНО: Передаем Component.PageTitle, а не Component.PageTitle()
        {
          Component: Component.PageTitle,
          // grow: true,
        },

        // Центральная секция: Меню
        // ИСПРАВЛЕНО: Передаем CustomMenu, а не CustomMenu()
        {
          Component: CustomMenu,
          grow: true,
          justifyContent: "center",
        },

        // Правая секция: Поиск, переключение режимов
        // ИСПРАВЛЕНО: Передаем анонимную функцию, которая возвращает Component.Flex
        {
          Component: () => Component.Flex({ // <--- ОБРАТИТЕ ВНИМАНИЕ НА ЭТО ИЗМЕНЕНИЕ
            components: [
              // ИСПРАВЛЕНО: Передаем Component.Search, Component.Darkmode, Component.ReaderMode
              { Component: Component.Search },
              { Component: Component.Darkmode },
              { Component: Component.ReaderMode },
            ],
          }),
          justifyContent: "flex-end",
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

// ... (остальная часть файла defaultContentPageLayout и defaultListPageLayout остается без изменений)
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

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer(), // Explorer остается в левой боковой панели
  ],
  right: [],
}

import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// --- НОВЫЙ КОМПОНЕНТ ДЛЯ МЕНЮ ---
// Этот компонент будет нашим пользовательским меню.
// Он использует Component.Flex для горизонтального расположения ссылок.
const CustomMenu = () => {
  return (
    <Component.Flex
      components={[
        // Каждый элемент меню — это объект с ключом 'Component',
        // значением которого является анонимная функция, возвращающая JSX (ссылку).
        { Component: () => <a href="/">Главная</a> },
        { Component: () => <a href="/">Теги</a> },
        { Component: () => <a href="/">О проекте</a> },
        // Добавляйте сюда другие ссылки, которые хотите видеть в меню.
      ]}
      // Вы можете добавить CSS-свойства прямо сюда для стилизации меню.
      // Например, чтобы добавить отступ между пунктами меню:
      // style={{ gap: "1.5rem" }}
    />
  )
}
// --- КОНЕЦ НОВОГО КОМПОНЕНТА ---

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    // Используем Component.Flex как основной контейнер для шапки.
    // Он позволит нам разместить элементы в ряд и контролировать их выравнивание.
    Component.Flex({
      components: [
        // === ЛЕВАЯ СЕКЦИЯ: ЗАГОЛОВОК САЙТА ===
        {
          // Component.PageTitle - это компонент, который отображает название вашего сайта.
          // Если вы хотите, чтобы он был ссылкой на главную, это уже встроено.
          Component: Component.PageTitle,
          // 'grow: false' означает, что этот элемент не будет растягиваться,
          // занимая только необходимое ему пространство.
          grow: false,
        },

        // === ЦЕНТРАЛЬНАЯ СЕКЦИЯ: ПОЛЬЗОВАТЕЛЬСКОЕ МЕНЮ ===
        {
          // Здесь мы вставляем наш только что созданный компонент CustomMenu.
          Component: CustomMenu,
          // 'grow: true' означает, что этот элемент будет занимать все доступное
          // пространство между левой и правой секциями.
          grow: true,
          // 'justifyContent: "center"' выравнивает содержимое CustomMenu по центру
          // в пределах доступного ему пространства.
          justifyContent: "center",
        },

        // === ПРАВАЯ СЕКЦИЯ: ПОИСК И ПЕРЕКЛЮЧЕНИЯ ===
        {
          // Для этой секции нам также нужен Flex-контейнер, чтобы разместить
          // поиск, Darkmode и ReaderMode в ряд.
          // Мы используем анонимную функцию, которая возвращает Flex-компонент,
          // содержащий нужные нам элементы.
          Component: () => Component.Flex({
            components: [
              // Component.Search - компонент поиска.
              { Component: Component.Search },
              // Component.Darkmode - переключатель темной/светлой темы.
              { Component: Component.Darkmode },
              // Component.ReaderMode - переключатель режима чтения.
              { Component: Component.ReaderMode },
            ],
            // Необязательно: добавить небольшой отступ между кнопками
            // style: { gap: "0.5rem" }
          }),
          // 'justifyContent: "flex-end"' выравнивает эту секцию по правому краю
          // в пределах ее родительского Flex-контейнера (основной шапки).
          justifyContent: "flex-end",
          // 'grow: false' означает, что эта секция не будет растягиваться,
          // занимая только необходимое ей пространство.
          grow: false,
        },
      ],
      // Дополнительные стили для основного Flex-контейнера шапки.
      // Например, чтобы добавить отступ между тремя основными секциями (левая, центральная, правая):
      // gap: "2rem",
      // Выравниваем элементы по центру по вертикали:
      // alignItems: "center",
    }),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
      // Добавьте свои ссылки здесь, если нужно
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
    // В левой боковой панели оставляем только Explorer и Spacer для мобильных устройств.
    // Заголовок сайта, поиск и Darkmode/ReaderMode теперь в шапке.
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer(),
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
    // Аналогично, в левой боковой панели оставляем только Explorer и Spacer для мобильных устройств.
    Component.MobileOnly(Component.Spacer()),
    Component.Explorer(),
  ],
  right: [], // Обычно для списков страниц правая панель пуста, если не нужны специфичные компоненты.
}
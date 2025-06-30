import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types";

interface Options {
  website: string;             // ID вашего сайта в comments.app
  limit?: number;              // макс. комментариев
  pageIdEnabled?: boolean;     // разделять по страницам
  color?: string;              // hex-цвет (без “#”)
  dislikes?: "0" | "1";        // показывать дизлайки
  outlined?: "0" | "1";        // контурные иконки
  colorful?: "0" | "1";        // цветные имена
  height?: number;             // фикс. высота в px
}

export default ((opts?: Options) => {
  const effectiveOpts: Options = { website: "", ...(opts || {}) };
  const WIDGET_URL = "https://comments.app/js/widget.js?3";

  const TelegramComments: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    if (fileData.frontmatter?.comments === false) return <></>;
    const site = effectiveOpts.website.trim();
    if (!site) {
      console.error("TelegramComments: параметр `website` не задан");
      return <div class="telegram-comments-error">Комментарии не настроены</div>;
    }

    const limit    = Math.min(Math.max(effectiveOpts.limit ?? 5, 1), 50).toString();
    const pageFlag = (effectiveOpts.pageIdEnabled ?? true).toString();
    const color    = effectiveOpts.color ?? "";
    const dislikes = effectiveOpts.dislikes ?? "";
    const outlined = effectiveOpts.outlined ?? "";
    const colorful = effectiveOpts.colorful ?? "";
    const height   = effectiveOpts.height?.toString() ?? "";

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
        <h2 class="telegram-comments-title">Комментарии</h2>
        <div
          id="telegram-comments-container"
          data-website={site}
          data-limit={limit}
          data-page-id-enabled={pageFlag}
          data-color={color}
          data-dislikes={dislikes}
          data-outlined={outlined}
          data-colorful={colorful}
          data-height={height}
        />
      </div>
    );
  };

  // Предзагрузка DNS
  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `;

// Вставьте этот код вместо вашего TelegramComments.afterDOMLoaded
TelegramComments.afterDOMLoaded = `
  (function() {
    // Функция для проверки, включена ли тёмная тема в Quartz
    function isDark() {
      return document.documentElement.getAttribute("saved-theme") === "dark";
    }

    // Основная функция для загрузки и перезагрузки виджета
    function loadComments() {
      const container = document.getElementById("telegram-comments-container");
      if (!container) return; // Если контейнера нет на странице, ничего не делаем

      // 1. Полностью очищаем контейнер и удаляем старый скрипт виджета
      // Это критически важно для SPA и смены темы, чтобы избежать дубликатов
      container.innerHTML = "";
      document.querySelectorAll('script[src^="https://comments.app/js/widget.js"]').forEach(s => s.remove());

      // 2. Определяем, какой цвет использовать
      const lightThemeColor = container.getAttribute("data-color") || ""; // из настроек компонента
      const darkThemeColor = "161618"; // Ваш кастомный цвет для тёмной темы (без #)
      
      const colorToUse = isDark() ? darkThemeColor : lightThemeColor;

      // 3. Создаем новый элемент <script> для виджета
      const script = document.createElement("script");
      script.async = true;
      script.src = "${WIDGET_URL}";

      // 4. Устанавливаем все необходимые атрибуты из data-* атрибутов контейнера
      script.setAttribute("data-comments-app-website", container.getAttribute("data-website"));
      
      // Передаем основные настройки
      const attributes = ["limit", "dislikes", "outlined", "colorful", "height"];
      attributes.forEach(attr => {
        const value = container.getAttribute("data-" + attr);
        if (value) {
          script.setAttribute("data-" + attr, value);
        }
      });
      
      // Устанавливаем ID страницы для разделения комментариев
      if (container.getAttribute("data-page-id-enabled") === "true") {
        script.setAttribute("data-page-id", window.location.pathname);
      }
      
      // 5. Устанавливаем вычисленный цвет. 
      // Виджет сам подберет цвет текста (белый на тёмном, чёрный на светлом)
      if (colorToUse) {
        script.setAttribute("data-color", colorToUse);
      }
      
      // Важно: НЕ устанавливаем data-dark="1", чтобы наш data-color имел приоритет

      // 6. Добавляем скрипт в контейнер, чтобы он загрузился
      container.appendChild(script);
    }

    // Функция для инициализации всего процесса
    function init() {
      // Первоначальная загрузка комментариев
      loadComments();

      // Отслеживание навигации в Quartz (когда вы переходите по ссылкам внутри сайта)
      document.addEventListener("nav", () => {
        // Небольшая задержка, чтобы DOM успел обновиться
        setTimeout(loadComments, 50); 
      });

      // Отслеживание смены темы в Quartz
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === "saved-theme") {
            loadComments();
            break;
          }
        }
      }).observe(document.documentElement, { attributes: true });
    }

    // Запускаем init() как только DOM будет готов
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
`;



  // CSS только для псевдо-индикатора загрузки
  TelegramComments.css = `
    .telegram-comments {
      margin-top: 2rem;
      border-top: 1px solid var(--lightgray);
      padding: 1rem 0;
    }
    .telegram-comments-title {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text);
    }
    #telegram-comments-container {
      width: 100%;
      min-height: 200px;
      background: var(--light);
      border-radius: 4px;
      position: relative;
    }
    /* Индикатор загрузки только когда контейнер действительно пуст */
    #telegram-comments-container:empty::before {
      content: "Загрузка комментариев…";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--secondary);
      font-style: italic;
    }
    @media (max-width: 600px) {
      .telegram-comments {
        margin-top: 1rem;
        padding: 0.5rem 0;
      }
    }
    .telegram-comments-error {
      padding: 1rem;
      margin: 1rem 0;
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 4px;
      color: var(--secondary);
      text-align: center;
      font-style: italic;
    }
  `;

  return TelegramComments;
}) satisfies QuartzComponentConstructor;

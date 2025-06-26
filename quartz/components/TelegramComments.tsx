import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  website: string             // ID вашего сайта в comments.app
  limit?: number              // максимальное число отображаемых комментариев
  pageIdEnabled?: boolean     // разделять комментарии по страницам
  color?: string              // hex-цвет акцентов (без “#”)
  dislikes?: "0" | "1"        // показывать дизлайки
  outlined?: "0" | "1"        // контурные иконки
  colorful?: "0" | "1"        // цветные имена пользователей
  height?: number             // фиксированная высота виджета в px
}

export default ((opts?: Options) => {
  // Дефолтные значения
  const effectiveOpts: Options = opts || { website: "" }
  const WIDGET_URL = "https://comments.app/js/widget.js?3"

  const TelegramComments: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    // Отключить комментарии через frontmatter
    if (fileData.frontmatter?.comments === false) return <></>

    // Валидация обязательного параметра
    const siteId = effectiveOpts.website.trim()
    if (!siteId) {
      console.error("TelegramComments: параметр `website` обязателен")
      return <div class="telegram-comments-error">Комментарии не настроены</div>
    }

    // Нормализация опций
    const limit    = Math.min(Math.max(effectiveOpts.limit ?? 5, 1), 50).toString()
    const pageFlag = (effectiveOpts.pageIdEnabled ?? true).toString()
    const color    = effectiveOpts.color ?? ""
    const dislikes = effectiveOpts.dislikes ?? ""
    const outlined = effectiveOpts.outlined ?? ""
    const colorful = effectiveOpts.colorful ?? ""
    const height   = effectiveOpts.height ? effectiveOpts.height.toString() : ""

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
        <h2 class="telegram-comments-title">Комментарии</h2>
        <div
          id="telegram-comments-container"
          data-website={siteId}
          data-limit={limit}
          data-page-id-enabled={pageFlag}
          data-color={color}
          data-dislikes={dislikes}
          data-outlined={outlined}
          data-colorful={colorful}
          data-height={height}
        />
      </div>
    )
  }

  // Предзагрузка DNS для ускорения
  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `

  // Базовая логика загрузки виджета без кастомных override-функций
  TelegramComments.afterDOMLoaded = `
    (function() {
      function loadComments() {
        const container = document.getElementById("telegram-comments-container");
        if (!container) return;

        container.innerHTML = "";
        document.querySelectorAll('script[src*="comments.app"]').forEach(s => s.remove());

        const siteId = container.getAttribute("data-website") || "";
        const limit = container.getAttribute("data-limit") || "5";
        const pageFlag = container.getAttribute("data-page-id-enabled") === "true";
        const color = container.getAttribute("data-color") || "";
        const dislikes = container.getAttribute("data-dislikes") || "";
        const outlined = container.getAttribute("data-outlined") || "";
        const colorful = container.getAttribute("data-colorful") || "";
        const height = container.getAttribute("data-height") || "";

        const script = document.createElement("script");
        script.async = true;
        script.src = "${WIDGET_URL}";
        script.setAttribute("data-comments-app-website", siteId);
        script.setAttribute("data-limit", limit);
        if (pageFlag) script.setAttribute("data-page-id", window.location.pathname);
        if (color) script.setAttribute("data-color", color);
        if (dislikes) script.setAttribute("data-dislikes", dislikes);
        if (outlined) script.setAttribute("data-outlined", outlined);
        if (colorful) script.setAttribute("data-colorful", colorful);
        if (height) script.setAttribute("data-height", height);

        script.onload = () => console.debug("TelegramComments: виджет загружен");
        script.onerror = () => {
          console.warn("TelegramComments: не удалось загрузить виджет");
          container.innerHTML = '<p class="telegram-comments-error">Комментарии недоступны</p>';
        };

        container.appendChild(script);
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadComments);
      } else {
        loadComments();
      }

      document.addEventListener("nav", loadComments);
      // Убираем все дополнительные слушатели и функции override
    })();
  `

  // Стили компонента
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
      position: relative;
      background-color: var(--light);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary);
      font-style: italic;
    }
    #telegram-comments-container:empty::before {
      content: "Загрузка комментариев...";
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
    @media (max-width: 600px) {
      .telegram-comments {
        margin-top: 1rem;
        padding: 0.5rem 0;
      }
    }
  `

  return TelegramComments
}) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  website: string             // ваш ID сайта в comments.app
  limit?: number              // максимальное число отображаемых комментариев
  pageIdEnabled?: boolean     // генерировать независимый раздел комментариев на каждой странице
  color?: string              // hex-код цвета акцентов (без “#”)
  dislikes?: "0" | "1"        // показывать дизлайки
  outlined?: "0" | "1"        // контурные иконки
  colorful?: "0" | "1"        // цветные имена пользователей
  height?: number             // фиксированная высота виджета
}

export default ((opts?: Options) => {
  const TelegramComments: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    // Отключение через frontmatter
    if (fileData.frontmatter?.comments === false) {
      return <></>
    }

    // Валидация и нормализация опций
    const siteId = opts?.website?.trim()
    if (!siteId) {
      console.error("TelegramComments: параметр `website` обязателен")
      return <div class="telegram-comments-error">Комментарии не настроены</div>
    }
    const limit    = Math.min(Math.max(opts.limit ?? 5, 1), 50).toString()
    const pageFlag = (opts.pageIdEnabled ?? true).toString()
    const color    = opts.color ?? ""
    const dislikes = opts.dislikes ?? ""
    const outlined = opts.outlined ?? ""
    const colorful = opts.colorful ?? ""
    const height   = opts.height ? opts.height.toString() : ""

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
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

  // DNS-предзагрузка для comments.app
  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `

  // Скрипт загрузки и обновления виджета с поддержкой dark-mode
  TelegramComments.afterDOMLoaded = `
    (function() {
      function loadComments() {
        const container = document.getElementById("telegram-comments-container");
        if (!container) return;

        // очистить прошлый виджет
        container.innerHTML = "";
        document.querySelectorAll('script[src*="comments.app"]').forEach(s => s.remove());

        // собрать параметры
        const siteId    = container.getAttribute("data-website") || "";
        const limit     = container.getAttribute("data-limit") || "5";
        const pageFlag  = container.getAttribute("data-page-id-enabled") === "true";
        const color     = container.getAttribute("data-color") || "";
        const dislikes  = container.getAttribute("data-dislikes") || "";
        const outlined  = container.getAttribute("data-outlined") || "";
        const colorful  = container.getAttribute("data-colorful") || "";
        const height    = container.getAttribute("data-height") || "";

        // создать и настроить скрипт
        const script = document.createElement("script");
        script.async = true;
        script.src   = "https://comments.app/js/widget.js?3";
        script.setAttribute("data-comments-app-website", siteId);
        script.setAttribute("data-limit", limit);
        if (pageFlag) script.setAttribute("data-page-id", window.location.pathname);
        if (color)    script.setAttribute("data-color", color);
        if (dislikes) script.setAttribute("data-dislikes", dislikes);
        if (outlined) script.setAttribute("data-outlined", outlined);
        if (colorful) script.setAttribute("data-colorful", colorful);
        if (height)   script.setAttribute("data-height", height);

        // включить dark-mode для comments.app, если Quartz в тёмной теме
        if (document.body.classList.contains("body--dark")) {
          script.setAttribute("data-dark", "1");
        }

        script.onload = () => console.debug("TelegramComments: виджет загружен");
        script.onerror = () => {
          console.warn("TelegramComments: не удалось загрузить виджет");
          container.innerHTML = '<p class="telegram-comments-error">Комментарии временно недоступны</p>';
        };

        container.appendChild(script);
      }

      // инициализация при загрузке страницы
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadComments);
      } else {
        loadComments();
      }
      // обновление при навигации SPA
      document.addEventListener("nav", loadComments);
      // обновление при смене темы Quartz
      window.addEventListener("themechange", loadComments);

      // очистка обработчиков
      if (typeof window.addCleanup === "function") {
        window.addCleanup(() => {
          document.removeEventListener("DOMContentLoaded", loadComments);
          document.removeEventListener("nav", loadComments);
          window.removeEventListener("themechange", loadComments);
        });
      }
    })();
  `

  // Встроенные стили компонента
  TelegramComments.css = `
    .telegram-comments {
      margin-top: 2rem;
      padding: 1rem 0;
      border-top: 1px solid var(--lightgray);
    }
    #telegram-comments-container {
      width: 100%;
      min-height: 200px;
      position: relative;
    }
    .telegram-comments-error {
      padding: 1rem;
      margin: 1rem 0;
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 4px;
      color: var(--secondary);
      font-style: italic;
      text-align: center;
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

// quartz/components/TelegramComments.tsx

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types";

// ... (интерфейс Options и начало компонента остаются без изменений) ...
interface Options {
  website: string;
  limit?: number;
  pageIdEnabled?: boolean;
  color?: string; 
  dislikes?: "0" | "1";
  outlined?: "0" | "1";
  colorful?: "0" | "1";
  height?: number;
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
    // ... (остальная часть рендер-функции без изменений) ...
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
          data-website={site} data-limit={limit} data-page-id-enabled={pageFlag}
          data-color={color} data-dislikes={dislikes} data-outlined={outlined}
          data-colorful={colorful} data-height={height}
        />
      </div>
    );
  };

  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `;

  // ЭТОТ JAVASCRIPT-БЛОК ОСТАВЛЯЕМ КАК ЕСТЬ (ИЗ ПРОШЛОГО ОТВЕТА)
  TelegramComments.afterDOMLoaded = `
  (function() {
    function isDark() {
      return document.documentElement.getAttribute("saved-theme") === "dark";
    }
    function loadComments() {
      const container = document.getElementById("telegram-comments-container");
      if (!container) return;
      container.innerHTML = "";
      document.querySelectorAll('script[src^="https://comments.app/js/widget.js"]').forEach(s => s.remove());
      const script = document.createElement("script");
      script.async = true;
      script.src = "${WIDGET_URL}";
      script.setAttribute("data-comments-app-website", container.getAttribute("data-website"));
      const attributes = ["limit", "dislikes", "outlined", "colorful", "height"];
      attributes.forEach(attr => {
        const value = container.getAttribute("data-" + attr);
        if (value) script.setAttribute("data-" + attr, value);
      });
      if (container.getAttribute("data-page-id-enabled") === "true") {
        script.setAttribute("data-page-id", window.location.pathname);
      }
      if (isDark()) {
        script.setAttribute("data-dark", "1");
        script.setAttribute("data-color", "161618");
      } else {
        const lightThemeColor = container.getAttribute("data-color");
        if (lightThemeColor) {
          script.setAttribute("data-color", lightThemeColor);
        }
      }
      container.appendChild(script);
    }
    function init() {
      loadComments();
      document.addEventListener("nav", () => setTimeout(loadComments, 50));
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === "saved-theme") {
            loadComments();
            break;
          }
        }
      }).observe(document.documentElement, { attributes: true });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
  `;

  // ИЗМЕНЕНИЯ ВНОСИМ СЮДА, В CSS
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
    }
    #telegram-comments-container {
      width: 100%;
      min-height: 200px;
      border-radius: 14px; /* Важно: радиус чуть больше, чем у виджета */
      position: relative;
      padding: 1px; /* Предотвращает "схлопывание" границ */
    }

    /* --- НОВЫЙ КОД --- */
    /* Устанавливаем фон для контейнера, который будет меняться вместе с темой Quartz */
    [saved-theme="light"] #telegram-comments-container {
      background: #fff; /* Или другой цвет для светлой темы, если нужно */
    }
    [saved-theme="dark"] #telegram-comments-container {
      background: #161618; /* НАШ ЦВЕТ! */
    }
    /* --- КОНЕЦ НОВОГО КОДА --- */

    #telegram-comments-container:empty::before {
      content: "Загрузка комментариев…";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--secondary);
      font-style: italic;
    }
    .telegram-comments-error {
      padding: 1rem; margin: 1rem 0; background: var(--light);
      border: 1px solid var(--lightgray); border-radius: 4px;
      color: var(--secondary); text-align: center; font-style: italic;
    }
  `;

  return TelegramComments;
}) satisfies QuartzComponentConstructor;

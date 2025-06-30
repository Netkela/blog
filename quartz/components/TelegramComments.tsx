// quartz/components/TelegramComments.tsx

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types";

interface Options {
  website: string;
  limit?: number;
  pageIdEnabled?: boolean;
  color?: string; // hex-цвет для СВЕТЛОЙ темы (без “#”)
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

  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `;

  // ЗАМЕНИТЕ ВАШ afterDOMLoaded НА ЭТОТ КОД
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
      
      // Передаем базовые атрибуты
      script.setAttribute("data-comments-app-website", container.getAttribute("data-website"));
      const attributes = ["limit", "dislikes", "outlined", "colorful", "height"];
      attributes.forEach(attr => {
        const value = container.getAttribute("data-" + attr);
        if (value) script.setAttribute("data-" + attr, value);
      });

      if (container.getAttribute("data-page-id-enabled") === "true") {
        script.setAttribute("data-page-id", window.location.pathname);
      }

      // --- КЛЮЧЕВАЯ ЛОГИКА ЗДЕСЬ ---
      if (isDark()) {
        // Для тёмной темы:
        // 1. Включаем "режим" тёмной темы (чтобы текст стал белым)
        script.setAttribute("data-dark", "1");
        // 2. И ПЕРЕОПРЕДЕЛЯЕМ цвет фона на наш кастомный
        script.setAttribute("data-color", "161618");
      } else {
        // для светлой темы просто используем цвет из настроек (если он есть)
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

  TelegramComments.css = `
    /* CSS остается без изменений */
    .telegram-comments { margin-top: 2rem; border-top: 1px solid var(--lightgray); padding: 1rem 0; }
    .telegram-comments-title { margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600; color: var(--text); }
    #telegram-comments-container { width: 100%; min-height: 200px; background: var(--light); border-radius: 4px; position: relative; }
    #telegram-comments-container:empty::before { content: "Загрузка комментариев…"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--secondary); font-style: italic; }
    @media (max-width: 600px) { .telegram-comments { margin-top: 1rem; padding: 0.5rem 0; } }
    .telegram-comments-error { padding: 1rem; margin: 1rem 0; background: var(--light); border: 1px solid var(--lightgray); border-radius: 4px; color: var(--secondary); text-align: center; font-style: italic; }
  `;

  return TelegramComments;
}) satisfies QuartzComponentConstructor;

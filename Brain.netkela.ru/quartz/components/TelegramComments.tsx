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
    if (fileData.frontmatter?.comments !== true) return <></>;
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
        <div class="telegram-comments-title">Комментарии</div>
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
  // Логика загрузки виджета и SPA-навигации
  TelegramComments.afterDOMLoaded = `
  (function() {
    let lastPath = null;
    function isDark() {
      return document.documentElement.getAttribute("saved-theme") === "dark";
    }
    function loadComments() {
      const c = document.getElementById("telegram-comments-container");
      if (!c) return;
      // Полная очистка контейнера
      c.innerHTML = "";
      // Удаляем старые скрипты
      document.querySelectorAll('script[src*="comments.app"]').forEach(s => s.remove());
      const attrs = [
        ["data-comments-app-website", c.getAttribute("data-website")],
        ["data-limit", c.getAttribute("data-limit")],
        ["data-color", c.getAttribute("data-color")],
        ["data-dislikes", c.getAttribute("data-dislikes")],
        ["data-outlined", c.getAttribute("data-outlined")],
        ["data-colorful", c.getAttribute("data-colorful")],
        ["data-height", c.getAttribute("data-height")]
      ];
      const script = document.createElement("script");
      script.async = true;
      script.src = "${WIDGET_URL}";
      attrs.forEach(([name, val]) => val && script.setAttribute(name, val));
      script.setAttribute("data-page-id", c.getAttribute("data-page-id-enabled") === "true" ? window.location.pathname : "");
      if (isDark()) script.setAttribute("data-dark", "1");
      c.appendChild(script);
    }
    // Инициализация и слушатели SPA
    function init() {
      loadComments();
      // React-style навигация в Quartz
      document.addEventListener("nav", loadComments);
      // pushState/replaceState
      const origPush = history.pushState, origReplace = history.replaceState;
      history.pushState = function() { origPush.apply(this, arguments); loadComments(); };
      history.replaceState = function() { origReplace.apply(this, arguments); loadComments(); };
      window.addEventListener("popstate", loadComments);
      // Монитор внешних изменений пути (резерв)
      setInterval(() => {
        if (window.location.pathname !== lastPath) {
          lastPath = window.location.pathname;
          loadComments();
        }
      }, 1000);
      // Тема
      window.addEventListener("themechange", loadComments);
      new MutationObserver(muts => muts.forEach(m => {
        if (m.attributeName === "saved-theme") loadComments();
      })).observe(document.documentElement, { attributes: true });
    }
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
      /* По умолчанию фон светлый, чтобы соответствовать теме */
      background: var(--light); 
      border-radius: 12px;
      position: relative;
      /* overflow: hidden оставляем как хорошую практику на всякий случай */
      overflow: hidden;
    }
    

    #telegram-comments-container iframe {
      border-radius: 12px;
      width: 100%;
      height: 100%;
      /* Убираем возможную рамку и делаем его блочным элементом */
      border: none;
      display: block;
    }
    
    /* В темной теме делаем фон контейнера прозрачным, чтобы не было белой вспышки */
    [saved-theme="dark"] #telegram-comments-container {
      background: transparent;
    }
    
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
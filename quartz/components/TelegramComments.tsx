import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types";
interface Options {
  website: string;             // ID вашего сайта в comments.app
  limit?: number;              // макс. комментариев
  pageIdEnabled?: boolean;     // разделять по страницам
  color?: string;              // hex-цвет (без "#")
  darkColor?: string;          // цвет для тёмной темы
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
    const darkColor = effectiveOpts.darkColor ?? "161618";
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
          data-dark-color={darkColor}
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
      
      // Получаем цвета
      const lightColor = c.getAttribute("data-color") || "";
      const darkColor = c.getAttribute("data-dark-color") || "161618";
      const currentColor = isDark() ? darkColor : lightColor;
      
      const attrs = [
        ["data-comments-app-website", c.getAttribute("data-website")],
        ["data-limit", c.getAttribute("data-limit")],
        ["data-color", currentColor],
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
      
      // Устанавливаем data-dark для тёмной темы
      if (isDark()) {
        script.setAttribute("data-dark", "1");
      }
      
      c.appendChild(script);
      
      // Применяем CSS хаки после загрузки виджета
      setTimeout(() => {
        if (isDark()) {
          const iframe = c.querySelector('iframe');
          if (iframe) {
            // Пытаемся внедрить стили через postMessage или другие методы
            try {
              iframe.style.colorScheme = 'dark';
              // Добавляем фильтр для инверсии белого фона
              if (iframe.contentDocument) {
                const style = iframe.contentDocument.createElement('style');
                style.textContent = \`
                  body, .comments-app-widget {
                    background-color: #161618 !important;
                  }
                \`;
                iframe.contentDocument.head.appendChild(style);
              }
            } catch (e) {
              // CORS блокирует доступ, используем CSS фильтры
              console.log("Cannot access iframe content, applying CSS filters");
            }
          }
        }
      }, 1000);
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
  // CSS с агрессивными стилями для тёмной темы
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
    
    /* Стили для тёмной темы */
    [saved-theme="dark"] #telegram-comments-container {
      background: #161618 !important;
    }
    
    /* Попытка стилизовать iframe в тёмной теме */
    [saved-theme="dark"] #telegram-comments-container iframe {
      background: #161618 !important;
      color-scheme: dark;
    }
    
    /* CSS хак для изменения фона внутри iframe (может не работать) */
    [saved-theme="dark"] #telegram-comments-container::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #161618;
      z-index: -1;
      pointer-events: none;
    }
    
    /* Альтернативный подход - использование фильтров для iframe */
    [saved-theme="dark"] #telegram-comments-container iframe[src*="comments.app"] {
      /* Инвертируем белый фон и затем корректируем оттенок */
      filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9);
    }
    
    /* Но кнопку нужно вернуть обратно */
    [saved-theme="dark"] #telegram-comments-container iframe[src*="comments.app"] button {
      filter: invert(1) hue-rotate(180deg);
    }
    
    /* Индикатор загрузки */
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

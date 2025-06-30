import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types";

interface Options {
  defaultChannel?: string;      // канал по умолчанию (например, "contest/198")
  defaultLimit?: number;        // лимит комментариев по умолчанию
  colorful?: "0" | "1";        // цветные имена пользователей
  darkMode?: "0" | "1" | "auto"; // тёмная тема: выкл/вкл/авто
}

export default ((opts?: Options) => {
  const effectiveOpts: Options = { 
    defaultChannel: "",
    defaultLimit: 5,
    colorful: "1",
    darkMode: "auto",
    ...(opts || {}) 
  };

  const WIDGET_URL = "https://telegram.org/js/telegram-widget.js?22";

  const TelegramWidget: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    // Проверяем frontmatter
    const widgetConfig = fileData.frontmatter?.tgwidget;
    
    // Если tgwidget отсутствует или false - не показываем виджет
    if (!widgetConfig) return <></>;
    
    // Определяем параметры виджета
    let channel = effectiveOpts.defaultChannel;
    let limit = effectiveOpts.defaultLimit;
    
    // Если tgwidget - строка, используем её как канал
    if (typeof widgetConfig === "string") {
      channel = widgetConfig;
    }
    // Если tgwidget - объект, извлекаем параметры
    else if (typeof widgetConfig === "object") {
      channel = widgetConfig.channel || channel;
      limit = widgetConfig.limit || limit;
    }
    
    // Если канал не указан - показываем ошибку
    if (!channel) {
      console.error("TelegramWidget: канал не указан");
      return <div class="telegram-widget-error">Telegram виджет не настроен</div>;
    }

    return (
      <div class={`telegram-widget ${displayClass ?? ""}`}>
        <h2 class="telegram-widget-title">Обсуждение в Telegram</h2>
        <div
          id="telegram-widget-container"
          data-channel={channel}
          data-limit={limit.toString()}
          data-colorful={effectiveOpts.colorful}
          data-dark-mode={effectiveOpts.darkMode}
        />
      </div>
    );
  };

  // Предзагрузка DNS
  TelegramWidget.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://telegram.org";
    document.head.appendChild(link);
  `;

  // Логика загрузки виджета
  TelegramWidget.afterDOMLoaded = `
  (function() {
    let lastPath = null;

    function isDark() {
      return document.documentElement.getAttribute("saved-theme") === "dark";
    }

    function loadWidget() {
      const container = document.getElementById("telegram-widget-container");
      if (!container) return;

      // Очищаем контейнер
      container.innerHTML = "";

      // Удаляем старые скрипты виджета
      document.querySelectorAll('script[src*="telegram.org/js/telegram-widget"]').forEach(s => s.remove());

      // Получаем параметры
      const channel = container.getAttribute("data-channel");
      const limit = container.getAttribute("data-limit");
      const colorful = container.getAttribute("data-colorful");
      const darkMode = container.getAttribute("data-dark-mode");

      // Создаём новый скрипт
      const script = document.createElement("script");
      script.async = true;
      script.src = "${WIDGET_URL}";
      script.setAttribute("data-telegram-discussion", channel);
      script.setAttribute("data-comments-limit", limit);
      
      if (colorful === "1") {
        script.setAttribute("data-colorful", "1");
      }

      // Управление тёмной темой
      if (darkMode === "1" || (darkMode === "auto" && isDark())) {
        script.setAttribute("data-dark", "1");
      }

      container.appendChild(script);
    }

    // Инициализация
    function init() {
      loadWidget();

      // SPA навигация
      document.addEventListener("nav", loadWidget);

      // History API
      const origPush = history.pushState;
      const origReplace = history.replaceState;
      history.pushState = function() {
        origPush.apply(this, arguments);
        loadWidget();
      };
      history.replaceState = function() {
        origReplace.apply(this, arguments);
        loadWidget();
      };
      window.addEventListener("popstate", loadWidget);

      // Мониторинг изменений URL
      setInterval(() => {
        if (window.location.pathname !== lastPath) {
          lastPath = window.location.pathname;
          loadWidget();
        }
      }, 1000);

      // Переключение темы
      if ("${effectiveOpts.darkMode}" === "auto") {
        window.addEventListener("themechange", loadWidget);
        new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.attributeName === "saved-theme") {
              loadWidget();
            }
          });
        }).observe(document.documentElement, { attributes: true });
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
  `;

  // CSS стили
  TelegramWidget.css = `
    .telegram-widget {
      margin-top: 2rem;
      border-top: 1px solid var(--lightgray);
      padding: 1rem 0;
    }

    .telegram-widget-title {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text);
    }

    #telegram-widget-container {
      width: 100%;
      min-height: 200px;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
    }

    /* Стилизация iframe виджета */
    #telegram-widget-container iframe {
      border-radius: 12px !important;
      width: 100% !important;
    }

    /* Индикатор загрузки */
    #telegram-widget-container:empty::before {
      content: "Загрузка обсуждения…";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--secondary);
      font-style: italic;
    }

    /* Мобильная адаптация */
    @media (max-width: 600px) {
      .telegram-widget {
        margin-top: 1rem;
        padding: 0.5rem 0;
      }
    }

    /* Сообщение об ошибке */
    .telegram-widget-error {
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

  return TelegramWidget;
}) satisfies QuartzComponentConstructor;

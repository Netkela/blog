// quartz/components/TelegramComments.tsx (имя файла остается прежним)
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  // Существующие опции для comments.app (сохраняем оригинальные имена)
  website: string;             // ID вашего сайта в comments.app
  limit?: number;              // максимальное число отображаемых комментариев
  pageIdEnabled?: boolean;     // разделять комментарии по страницам
  color?: string;              // hex-цвет акцентов (без “#”)
  dislikes?: "0" | "1";        // показывать дизлайки
  outlined?: "0" | "1";        // контурные иконки
  colorful?: "0" | "1";        // цветные имена пользователей
  height?: number;             // фиксированная высота виджета в px

  // Новые опции для Telegram (встроенного виджета)
  telegramWidgetLimit?: number; // data-comments-limit для Telegram
  telegramWidgetDark?: "0" | "1"; // data-dark для Telegram (тема)
}

export default ((opts?: Options) => {
  // Явная проверка и дефолт для opts
  // Теперь website обязателен для comments.app, но может быть пустым, если используется Telegram
  const effectiveOpts: Options = opts || { website: "" };

  // URL-ы для обоих виджетов
  const COMMENTS_APP_WIDGET_URL = "https://comments.app/js/widget.js?3";
  const TELEGRAM_WIDGET_URL = "https://telegram.org/js/telegram-widget.js?22";

  const TelegramComments: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    // Получаем 'comments: false' и 'telegramWidget' из frontmatter
    const commentsDisabled = fileData.frontmatter?.comments === false;
    const telegramWidgetId = fileData.frontmatter?.telegramWidget as string | undefined; // Используем telegramWidget

    // Определяем, какой виджет использовать
    let useTelegramWidget = false;
    if (commentsDisabled && telegramWidgetId) {
      useTelegramWidget = true; // comments: false, но есть telegramWidget -> используем Telegram
    } else if (!commentsDisabled && telegramWidgetId) {
      // comments: true (или отсутствует), и есть telegramWidget -> приоритет Telegram
      useTelegramWidget = true; 
    } else if (commentsDisabled && !telegramWidgetId) {
      // comments: false и нет telegramWidget -> не показываем ничего
      return <></>; 
    }
    // В остальных случаях (comments: true или отсутствует, и нет telegramWidget) -> используем comments.app

    // --- Логика для comments.app ---
    const commentsAppSiteId = effectiveOpts.website.trim(); // Используем 'website' из opts
    if (!useTelegramWidget && !commentsAppSiteId) {
      // Это условие теперь срабатывает, только если мы пытаемся использовать comments.app,
      // но 'website' не указан.
      console.error("TelegramComments: обязательный параметр `website` не задан для comments.app");
      return <div class="comments-error">Комментарии не настроены (comments.app)</div>;
    }
    const commentsAppLimit    = Math.min(Math.max(effectiveOpts.limit ?? 5, 1), 50).toString(); // Используем 'limit'
    const commentsAppPageFlag = (effectiveOpts.pageIdEnabled ?? true).toString(); // Используем 'pageIdEnabled'
    const commentsAppColor    = effectiveOpts.color ?? ""; // Используем 'color'
    const commentsAppDislikes = effectiveOpts.dislikes ?? ""; // Используем 'dislikes'
    const commentsAppOutlined = effectiveOpts.outlined ?? ""; // Используем 'outlined'
    const commentsAppColorful = effectiveOpts.colorful ?? ""; // Используем 'colorful'
    const commentsAppHeight   = effectiveOpts.height ? effectiveOpts.height.toString() : ""; // Используем 'height'

    // --- Логика для Telegram (встроенного виджета) ---
    const telegramWidgetLimit = (effectiveOpts.telegramWidgetLimit ?? 5).toString();
    const telegramWidgetDark  = effectiveOpts.telegramWidgetDark ?? "1"; // Дефолт - темная тема

    return (
      <div class={`comments-widget ${displayClass ?? ""}`}>
        {/* Заголовок */}
        <h2 class="comments-widget-title">Комментарии</h2>

        {/* Контейнер для виджета */}
        <div
          id="comments-widget-container" // Общий ID для контейнера
          data-widget-type={useTelegramWidget ? "telegram" : "comments-app"} // Указываем тип виджета
          // Данные для comments.app
          data-comments-app-website={commentsAppSiteId}
          data-comments-app-limit={commentsAppLimit}
          data-comments-app-page-id-enabled={commentsAppPageFlag}
          data-comments-app-color={commentsAppColor}
          data-comments-app-dislikes={commentsAppDislikes}
          data-comments-app-outlined={commentsAppOutlined}
          data-comments-app-colorful={commentsAppColorful}
          data-comments-app-height={commentsAppHeight}
          // Данные для Telegram
          data-telegram-widget-id={telegramWidgetId || ""} // Передаем ID виджета Telegram
          data-telegram-widget-limit={telegramWidgetLimit}
          data-telegram-widget-dark={telegramWidgetDark}
        />
      </div>
    );
  };

  // DNS-предзагрузка (для обоих)
  TelegramComments.beforeDOMLoaded = `
    const linkCommentsApp = document.createElement("link");
    linkCommentsApp.rel = "preconnect";
    linkCommentsApp.href = "https://comments.app";
    document.head.appendChild(linkCommentsApp);

    const linkTelegram = document.createElement("link");
    linkTelegram.rel = "preconnect";
    linkTelegram.href = "https://telegram.org";
    document.head.appendChild(linkTelegram);
  `;

  // Логика загрузки и перезагрузки виджета с оптимизацией MutationObserver
  TelegramComments.afterDOMLoaded = `
    (function() {
      let lastLoadedIsDark = null;

      function isQuartzDark() {
        return document.documentElement.getAttribute("saved-theme") === "dark";
      }

      function loadCommentsWidget() {
        const container = document.getElementById("comments-widget-container");
        if (!container) return;

        const currentIsDark = isQuartzDark();
        // Проверяем, изменилась ли тема, чтобы перезагрузить виджет.
        // Для Telegram виджета, themechange должен быть обработан.
        // Для comments.app он может иметь собственную логику.
        // Если тема не изменилась и виджет уже был загружен, не перезагружаем.
        if (lastLoadedIsDark !== null && lastLoadedIsDark === currentIsDark) {
            // Если это Telegram виджет, и тема изменилась, перезагружаем.
            if (container.getAttribute("data-widget-type") === "telegram") {
                const telegramDarkAttr = container.getAttribute("data-telegram-widget-dark");
                if ((currentIsDark && telegramDarkAttr !== "1") || (!currentIsDark && telegramDarkAttr !== "0")) {
                    // Тема изменилась, но data-dark не соответствует.
                    // Принудительно перезагружаем, чтобы применилась новая тема.
                } else {
                    return; // Тема не изменилась, и data-dark соответствует, не перезагружаем.
                }
            } else { // comments.app
                return; // Если тема не изменилась, не перезагружаем.
            }
        }
        lastLoadedIsDark = currentIsDark;

        // Удаляем старые скрипты виджетов
        container.innerHTML = "";
        document.querySelectorAll('script[src*="comments.app"]').forEach(s => s.remove());
        document.querySelectorAll('script[src*="telegram.org"]').forEach(s => s.remove());

        const widgetType = container.getAttribute("data-widget-type");
        const script = document.createElement("script");
        script.async = true;

        if (widgetType === "telegram") {
          script.src = "${TELEGRAM_WIDGET_URL}";
          script.setAttribute("data-telegram-discussion", container.getAttribute("data-telegram-widget-id") || ""); // Имя атрибута в скрипте Telegram
          script.setAttribute("data-comments-limit", container.getAttribute("data-telegram-widget-limit") || "5");
          // Применяем тему: если Quartz темный, используем data-dark="1", иначе data-dark="0"
          script.setAttribute("data-dark", currentIsDark ? "1" : "0"); 
        } else { // comments-app
          script.src = "${COMMENTS_APP_WIDGET_URL}";
          script.setAttribute("data-comments-app-website", container.getAttribute("data-comments-app-website") || "");
          script.setAttribute("data-limit", container.getAttribute("data-comments-app-limit") || "5");
          if (container.getAttribute("data-comments-app-page-id-enabled") === "true") {
            script.setAttribute("data-page-id", window.location.pathname);
          }
          // Остальные атрибуты comments.app
          const colorAttr = container.getAttribute("data-comments-app-color");
          if (colorAttr) script.setAttribute("data-color", colorAttr);
          const dislikesAttr = container.getAttribute("data-comments-app-dislikes");
          if (dislikesAttr) script.setAttribute("data-dislikes", dislikesAttr);
          const outlinedAttr = container.getAttribute("data-comments-app-outlined");
          if (outlinedAttr) script.setAttribute("data-outlined", outlinedAttr);
          const colorfulAttr = container.getAttribute("data-comments-app-colorful");
          if (colorfulAttr) script.setAttribute("data-colorful", colorfulAttr);
          const heightAttr = container.getAttribute("data-comments-app-height");
          if (heightAttr) script.setAttribute("data-height", heightAttr);
          
          // Для comments.app тоже применяем тему, если он ее поддерживает
          // (предполагаем, что comments.app также может принимать data-dark)
          if (currentIsDark) {
            script.setAttribute("data-dark", "1"); 
          }
        }
        
        script.onload = () => console.debug(`TelegramComments: ${widgetType} виджет загружен`);
        script.onerror = () => {
          console.warn(`TelegramComments: не удалось загрузить ${widgetType} виджет`);
          container.innerHTML = `<p class="comments-error">Комментарии недоступны (${widgetType})</p>`;
        };

        container.appendChild(script);
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadCommentsWidget);
      } else {
        loadCommentsWidget();
      }
      document.addEventListener("nav", loadCommentsWidget);
      window.addEventListener("themechange", loadCommentsWidget);

      const observer = new MutationObserver(muts => {
        muts.forEach(m => {
          if (m.attributeName === "saved-theme") {
            loadCommentsWidget();
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true });

      if (typeof window.addCleanup === "function") {
        window.addCleanup(() => {
          document.removeEventListener("DOMContentLoaded", loadCommentsWidget);
          document.removeEventListener("nav", loadCommentsWidget);
          window.removeEventListener("themechange", loadCommentsWidget);
          observer.disconnect();
        });
      }
    })();
  `;

  // CSS остается прежним, общие классы
  TelegramComments.css = `
    .comments-widget { /* Общий класс для контейнера */
      margin-top: 2rem;
      border-top: 1px solid var(--lightgray);
      padding: 1rem 0;
    }
    .comments-widget-title { /* Общий класс для заголовка */
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text);
    }
    #comments-widget-container { /* Общий ID для контейнера виджета */
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
    #comments-widget-container:empty::before {
      content: "Загрузка комментариев...";
    }
    @media (max-width: 600px) {
      .comments-widget {
        margin-top: 1rem;
        padding: 0.5rem 0;
      }
    }
    .comments-error { /* Общий класс для ошибок */
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

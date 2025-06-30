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
  // 1. Явная проверка и дефолт для opts
  const effectiveOpts: Options = opts || { website: "" }
  const WIDGET_URL = "https://comments.app/js/widget.js?3"  // 2. Константа URL

  const TelegramComments: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    // Отключение через frontmatter
    if (fileData.frontmatter?.comments === false) return <></>

    // Нормализация опций
    const siteId = effectiveOpts.website.trim()
    if (!siteId) {
      console.error("TelegramComments: обязательный параметр `website` не задан")
      return <div class="telegram-comments-error">Комментарии не настроены</div>
    }
    const limit    = Math.min(Math.max(effectiveOpts.limit ?? 5, 1), 50).toString()
    const pageFlag = (effectiveOpts.pageIdEnabled ?? true).toString()
    const color    = effectiveOpts.color ?? ""
    const dislikes = effectiveOpts.dislikes ?? ""
    const outlined = effectiveOpts.outlined ?? ""
    const colorful = effectiveOpts.colorful ?? ""
    const height   = effectiveOpts.height ? effectiveOpts.height.toString() : ""

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
        {/* Заголовок */}
        <h2 class="telegram-comments-title">Комментарии</h2>

        {/* Контейнер для виджета */}
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

  // DNS-предзагрузка
  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `

  // Логика загрузки и перезагрузки виджета с оптимизацией MutationObserver
  TelegramComments.afterDOMLoaded = `
  (function() {
    let isInitialized = false;
    let observer = null;
    let pathCheckInterval = null;

    function isQuartzDark() {
      return document.documentElement.getAttribute("saved-theme") === "dark";
    }

    function loadCommentsWidget() {
      const container = document.getElementById("telegram-comments-container");
      if (!container) {
        console.warn("TelegramComments: контейнер не найден");
        return;
      }

      console.debug("TelegramComments: загрузка виджета для", window.location.pathname);
      
      // Показываем индикатор загрузки
      container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--secondary);">Загрузка комментариев...</div>';
      
      // Полная очистка предыдущих скриптов
      document.querySelectorAll('script[src*="comments.app"]').forEach(script => {
        script.remove();
      });
      
      // Очистка глобальных переменных comments.app (если есть)
      if (window.commentsApp) {
        delete window.commentsApp;
      }

      const siteId = container.getAttribute("data-website") || "";
      const limit = container.getAttribute("data-limit") || "5";
      const pageFlag = container.getAttribute("data-page-id-enabled") === "true";
      const color = container.getAttribute("data-color") || "";
      const dislikes = container.getAttribute("data-dislikes") || "";
      const outlined = container.getAttribute("data-outlined") || "";
      const colorful = container.getAttribute("data-colorful") || "";
      const height = container.getAttribute("data-height") || "";
      const currentIsDark = isQuartzDark();

      // Задержка для стабилизации DOM после навигации
      setTimeout(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = "${WIDGET_URL}" + "&_t=" + Date.now(); // Добавляем timestamp для предотвращения кеширования
        script.setAttribute("data-comments-app-website", siteId);
        script.setAttribute("data-limit", limit);
        
        if (pageFlag) {
          script.setAttribute("data-page-id", window.location.pathname);
        }
        if (color) script.setAttribute("data-color", color);
        if (dislikes) script.setAttribute("data-dislikes", dislikes);
        if (outlined) script.setAttribute("data-outlined", outlined);
        if (colorful) script.setAttribute("data-colorful", colorful);
        if (height) script.setAttribute("data-height", height);
        if (currentIsDark) {
          script.setAttribute("data-dark", "1");
        }

        script.onload = () => {
          console.debug("TelegramComments: виджет успешно загружен");
          // Убираем индикатор загрузки через небольшую задержку
          setTimeout(() => {
            const loadingDiv = container.querySelector('div[style*="Загрузка комментариев"]');
            if (loadingDiv) {
              loadingDiv.remove();
            }
          }, 500);
        };
        
        script.onerror = () => {
          console.error("TelegramComments: ошибка загрузки виджета");
          container.innerHTML = '<div class="telegram-comments-error">Не удалось загрузить комментарии</div>';
        };

        // Очищаем контейнер и добавляем новый скрипт
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--secondary);">Загрузка комментариев...</div>';
        container.appendChild(script);
      }, 200);
    }

    // Множественные способы отслеживания навигации
    function setupNavigationListeners() {
      // 1. Основной обработчик Quartz nav
      document.addEventListener("nav", function(event) {
        console.debug("TelegramComments: nav событие обнаружено");
        loadCommentsWidget();
      });

      // 2. Отслеживание изменений в History API
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function() {
        originalPushState.apply(history, arguments);
        console.debug("TelegramComments: pushState обнаружен");
        setTimeout(loadCommentsWidget, 100);
      };

      history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        console.debug("TelegramComments: replaceState обнаружен");
        setTimeout(loadCommentsWidget, 100);
      };

      // 3. Отслеживание popstate
      window.addEventListener("popstate", function() {
        console.debug("TelegramComments: popstate обнаружен");
        setTimeout(loadCommentsWidget, 100);
      });

      // 4. Периодическая проверка URL (резервный механизм)
      let currentPath = window.location.pathname;
      pathCheckInterval = setInterval(() => {
        if (window.location.pathname !== currentPath) {
          currentPath = window.location.pathname;
          console.debug("TelegramComments: изменение пути обнаружено:", currentPath);
          loadCommentsWidget();
        }
      }, 1000);

      // 5. MutationObserver для отслеживания изменений в основном контенте
      observer = new MutationObserver((mutations) => {
        let shouldReload = false;
        
        mutations.forEach((mutation) => {
          // Проверяем изменения темы
          if (mutation.type === 'attributes' && mutation.attributeName === 'saved-theme') {
            shouldReload = true;
          }
          
          // Проверяем появление нового контейнера комментариев
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && (
                node.id === 'telegram-comments-container' || 
                node.querySelector && node.querySelector('#telegram-comments-container')
              )) {
                shouldReload = true;
              }
            });
          }
        });

        if (shouldReload) {
          console.debug("TelegramComments: DOM изменения обнаружены");
          setTimeout(loadCommentsWidget, 150);
        }
      });

      // Наблюдаем за изменениями в документе
      observer.observe(document.documentElement, { 
        attributes: true, 
        childList: true, 
        subtree: true 
      });
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }

    // Инициализация
    function initialize() {
      if (isInitialized) return;
      isInitialized = true;

      console.debug("TelegramComments: инициализация");
      
      // Первоначальная загрузка
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadCommentsWidget);
      } else {
        loadCommentsWidget();
      }

      // Настройка всех слушателей навигации
      setupNavigationListeners();
    }

    // Очистка ресурсов
    function cleanup() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (pathCheckInterval) {
        clearInterval(pathCheckInterval);
        pathCheckInterval = null;
      }
      isInitialized = false;
    }

    // Запуск инициализации
    initialize();

    // Регистрация очистки для Quartz
    if (typeof window.addCleanup === "function") {
      window.addCleanup(cleanup);
    }

    // Дополнительная очистка при выгрузке страницы
    window.addEventListener("beforeunload", cleanup);
  })();
`


  // 4. Улучшенный UX: индикатор загрузки и фон для контейнера
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

    /* Скрывать ::before, когда внутри есть дочерние узлы */
#telegram-comments-container:not(:empty)::before {
  content: none !important;
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
  `

  return TelegramComments
}) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  website: string             // ваш ID сайта в comments.app
  limit?: number              // число отображаемых комментариев
  pageIdEnabled?: boolean     // разделять комментарии по страницам
  color?: string              // hex-цвет акцентов без "#"
  dislikes?: "0" | "1"        // показывать дизлайки
  outlined?: "0" | "1"        // контурные иконки
  colorful?: "0" | "1"        // цветные имена пользователей
  height?: number             // высота виджета в px
}

export default ((opts?: Options) => {
  const TelegramComments: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    if (fileData.frontmatter?.comments === false) return <></>

    const siteId = opts?.website?.trim()
    if (!siteId) {
      console.error("TelegramComments: обязательный параметр website не задан")
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

  // Предзагрузка DNS
  TelegramComments.beforeDOMLoaded = `
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://comments.app";
    document.head.appendChild(link);
  `

  TelegramComments.afterDOMLoaded = `
    (function() {
      // Функция создания/перезапуска виджета
      function loadComments() {
        const container = document.getElementById("telegram-comments-container");
        if (!container) return;

        // Очистка предыдущего виджета
        container.innerHTML = "";
        document.querySelectorAll('script[src*="comments.app"]').forEach(s => s.remove());

        // Сбор параметров
        const siteId    = container.getAttribute("data-website") || "";
        const limit     = container.getAttribute("data-limit") || "5";
        const pageFlag  = container.getAttribute("data-page-id-enabled") === "true";
        const color     = container.getAttribute("data-color") || "";
        const dislikes  = container.getAttribute("data-dislikes") || "";
        const outlined  = container.getAttribute("data-outlined") || "";
        const colorful  = container.getAttribute("data-colorful") || "";
        const height    = container.getAttribute("data-height") || "";

        // Создание скрипта комментариев
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://comments.app/js/widget.js?3";
        script.setAttribute("data-comments-app-website", siteId);
        script.setAttribute("data-limit", limit);
        if (pageFlag)  script.setAttribute("data-page-id", window.location.pathname);
        if (color)     script.setAttribute("data-color", color);
        if (dislikes)  script.setAttribute("data-dislikes", dislikes);
        if (outlined)  script.setAttribute("data-outlined", outlined);
        if (colorful)  script.setAttribute("data-colorful", colorful);
        if (height)    script.setAttribute("data-height", height);

        // Включение data-dark при dark-mode Quartz
        if (document.body.classList.contains("body--dark")) {
          script.setAttribute("data-dark", "1");
        }

        script.onload = () => console.debug("TelegramComments: виджет загружен");
        script.onerror = () => {
          console.warn("TelegramComments: ошибка загрузки виджета");
          container.innerHTML = '<p class="telegram-comments-error">Комментарии недоступны</p>';
        };

        container.appendChild(script);
      }

      // Инициализация
      const init = () => {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", loadComments);
        } else {
          loadComments();
        }
        document.addEventListener("nav", loadComments);
        window.addEventListener("themechange", loadComments);

        // Наблюдатель за сменой класса body
        const observer = new MutationObserver(muts => {
          for (const m of muts) {
            if (m.attributeName === "class") {
              loadComments();
              break;
            }
          }
        });
        observer.observe(document.body, { attributes: true });

        // Cleanup
        if (typeof window.addCleanup === "function") {
          window.addCleanup(() => {
            document.removeEventListener("DOMContentLoaded", loadComments);
            document.removeEventListener("nav", loadComments);
            window.removeEventListener("themechange", loadComments);
            observer.disconnect();
          });
        }
      }

      init();
    })();
  `

  TelegramComments.css = `
    .telegram-comments {
      margin-top: 2rem;
      padding: 1rem 0;
      border-top: 1px solid var(--lightgray);
    }
    #telegram-comments-container {
      width: 100%;
      min-height: 200px;
    }
    .telegram-comments-error {
      padding: 1rem;
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

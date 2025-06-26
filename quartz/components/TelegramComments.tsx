import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  website: string
  limit?: number
  pageIdEnabled?: boolean
  color?: string
  dislikes?: "0" | "1"
  outlined?: "0" | "1"
  colorful?: "0" | "1"
  height?: number
  theme?: "light" | "dark" | "auto"
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
    const websiteId = opts?.website?.trim()
    if (!websiteId) {
      console.error("TelegramComments: Не задан обязательный параметр website")
      return <div class="telegram-comments-error">Комментарии не настроены</div>
    }
    const limit = Math.min(Math.max(opts?.limit ?? 5, 1), 50).toString()
    const pageIdEnabled = opts?.pageIdEnabled ?? true
    const color = opts?.color ?? ""
    const dislikes = opts?.dislikes ?? ""
    const outlined = opts?.outlined ?? ""
    const colorful = opts?.colorful ?? ""
    const height = opts?.height ? `${opts.height}` : ""
    const theme = opts?.theme ?? ""

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
        <div
          id="telegram-comments-container"
          data-website={websiteId}
          data-limit={limit}
          data-page-id-enabled={pageIdEnabled.toString()}
          data-color={color}
          data-dislikes={dislikes}
          data-outlined={outlined}
          data-colorful={colorful}
          data-height={height}
          data-theme={theme}
        />
      </div>
    )
  }

  // Предзагрузка DNS и стилей перед загрузкой виджета
  TelegramComments.beforeDOMLoaded = `
    // Предзагрузить DNS для comments.app
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://comments.app';
    document.head.appendChild(preconnect);
  `

  // Логика загрузки и обновления виджета
  TelegramComments.afterDOMLoaded = `
    (function() {
      const loadComments = () => {
        const container = document.getElementById("telegram-comments-container");
        if (!container) return;

        // Очистить предыдущий виджет
        container.innerHTML = "";

        // Удалить старые скрипты
        const old = document.querySelectorAll('script[data-comments-app-website]');
        old.forEach(el => el.remove());

        // Собрать параметры
        const website = container.getAttribute("data-website");
        const limit = container.getAttribute("data-limit");
        const pageIdEnabled = container.getAttribute("data-page-id-enabled") === "true";
        const color = container.getAttribute("data-color");
        const dislikes = container.getAttribute("data-dislikes");
        const outlined = container.getAttribute("data-outlined");
        const colorful = container.getAttribute("data-colorful");
        const height = container.getAttribute("data-height");
        const theme = container.getAttribute("data-theme");

        // Создать скрипт виджета
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://comments.app/js/widget.js?3";
        script.setAttribute("data-comments-app-website", website);
        script.setAttribute("data-limit", limit);
        if (pageIdEnabled) script.setAttribute("data-page-id", window.location.pathname);
        if (color) script.setAttribute("data-color", color);
        if (dislikes) script.setAttribute("data-dislikes", dislikes);
        if (outlined) script.setAttribute("data-outlined", outlined);
        if (colorful) script.setAttribute("data-colorful", colorful);
        if (height) script.setAttribute("data-height", height);
        if (theme) script.setAttribute("data-theme", theme);

        // Обработчики загрузки/ошибки
        script.onload = () => console.log("Telegram Comments загружены");
        script.onerror = () => {
          console.warn("Не удалось загрузить Telegram Comments");
          container.innerHTML = '<p class="telegram-comments-error">Комментарии недоступны</p>';
        };

        container.appendChild(script);
      };

      // Загрузить при первичной загрузке
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadComments);
      } else {
        loadComments();
      }

      // Обработать SPA-навигацию
      document.addEventListener("nav", loadComments);

      // Cleanup для предотвращения утечек
      if (typeof window.addCleanup === "function") {
        window.addCleanup(() => {
          document.removeEventListener("DOMContentLoaded", loadComments);
          document.removeEventListener("nav", loadComments);
        });
      }
    })();
  `

  // Встроенные стили (если не используете внешний SCSS)
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

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  discussion: string          // ваш ID обсуждения, например "netkelago"
  limit?: number              // число отображаемых комментариев
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

    const discussionId = opts?.discussion?.trim()
    if (!discussionId) {
      console.error("TelegramComments: параметр «discussion» не задан")
      return <div class="telegram-comments-error">Комментарии не настроены</div>
    }

    const limit = Math.min(Math.max(opts?.limit ?? 5, 1), 50).toString()

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
        <div
          id="telegram-comments-container"
          data-discussion={discussionId}
          data-comments-limit={limit}
        />
      </div>
    )
  }

  TelegramComments.afterDOMLoaded = `
    (function() {
      function loadTelegramDiscussion() {
        const container = document.getElementById("telegram-comments-container");
        if (!container) return;

        // Очистить предыдущий виджет
        container.innerHTML = "";
        document.querySelectorAll('script[src*="telegram-widget.js"]').forEach(s => s.remove());

        // Параметры из data-атрибутов
        const discussion = container.getAttribute("data-discussion")!;
        const limit = container.getAttribute("data-comments-limit")!;

        // Создать скрипт официального виджета Telegram
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-discussion", discussion);
        script.setAttribute("data-comments-limit", limit);

        // Если активна тёмная тема Quartz (класс на body: body--dark), включаем тёмный режим виджета[2]
        if (document.body.classList.contains("body--dark")) {
          script.setAttribute("data-dark", "1");
        }

        script.onerror = () => {
          console.warn("TelegramComments: не удалось загрузить виджет");
          container.innerHTML = '<p class="telegram-comments-error">Комментарии недоступны</p>';
        };

        container.appendChild(script);
      }

      // Загрузка при инициалном рендере
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadTelegramDiscussion);
      } else {
        loadTelegramDiscussion();
      }

      // Обновление при переходах SPA
      document.addEventListener("nav", loadTelegramDiscussion);

      // Обновление при переключении темы Quartz (событие themechange)[8]
      window.addEventListener("themechange", loadTelegramDiscussion);

      // Cleanup для предотвращения утечек
      if (typeof window.addCleanup === "function") {
        window.addCleanup(() => {
          document.removeEventListener("DOMContentLoaded", loadTelegramDiscussion);
          document.removeEventListener("nav", loadTelegramDiscussion);
          window.removeEventListener("themechange", loadTelegramDiscussion);
        });
      }
    })();
  `

  TelegramComments.css = `
    .telegram-comments {
      margin-top: 2rem;
      border-top: 1px solid var(--lightgray);
      padding: 1rem 0;
    }
    #telegram-comments-container {
      min-height: 200px;
    }
    .telegram-comments-error {
      padding: 1rem;
      color: var(--secondary);
      font-style: italic;
      text-align: center;
    }
  `

  return TelegramComments
}) satisfies QuartzComponentConstructor

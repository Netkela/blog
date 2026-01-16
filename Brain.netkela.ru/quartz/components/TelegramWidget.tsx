// quartz/components/TelegramWidget.tsx
import React from "react"
import {
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"
import { classNames } from "../util/lang"

interface TelegramWidgetOptions {
  channel: string      // имя Telegram-канала, например "netkelago"
  limit?: number       // максимальное число комментариев (по умолчанию 5)
}

const TelegramWidget: QuartzComponentConstructor<TelegramWidgetOptions> = (options) => {
  const { channel, limit = 5 } = options

  const TelegramWidgetComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const tgwidget = fileData.frontmatter?.tgwidget as boolean
    const postId  = fileData.frontmatter?.tgpost as string  // читаем номер поста

    if (!tgwidget) return null

    return (
      <div className={classNames(displayClass, "telegram-widget-wrapper")}>
        <div className="telegram-widget-title">Комментарии</div>
        {/* Передаём postId в data-атрибут контейнера */}
        <div
          id="telegram-widget-container"
          data-post-id={postId ?? ""}
        />
      </div>
    )
  }

  // Скрипт загрузки виджета с поддержкой тёмной темы и учётом postId
  TelegramWidgetComponent.afterDOMLoaded = `
    (function() {
      function isDark() {
        return document.documentElement.getAttribute("saved-theme") === "dark";
      }

      function loadTelegramWidget() {
        const container = document.getElementById("telegram-widget-container");
        if (!container) return;

        // Определяем номер поста из data-атрибута
        const postId = container.getAttribute("data-post-id");
        // Формируем значение data-telegram-discussion
        const discussion = postId
          ? "${channel}/" + postId
          : "${channel}";

        // Очищаем контейнер и удаляем старые скрипты
        container.innerHTML = "";
        document.querySelectorAll('script[src*="telegram.org/js/telegram-widget.js"]').forEach(s => s.remove());

        // Создаём новый <script> для виджета
        const script = document.createElement("script");
        script.async = true;
        script.src   = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-discussion", discussion);
        script.setAttribute("data-comments-limit", "${limit}");
        if (isDark()) {
          script.setAttribute("data-dark", "1");
        }
        container.appendChild(script);
      }

      // Инициализация и слушатели
      function init() {
        loadTelegramWidget();
        window.addEventListener("themechange", loadTelegramWidget);
        const observer = new MutationObserver(muts => {
          muts.forEach(m => {
            if (m.attributeName === "saved-theme") loadTelegramWidget();
          });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] });
        document.addEventListener("nav", loadTelegramWidget);
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
      } else {
        init();
      }
    })();
  `

  // Стили компонента
  TelegramWidgetComponent.css = `
    .telegram-widget-wrapper {
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
      min-height: 200px;
      position: relative;
    }
    #telegram-widget-container:empty::before {
      content: "Загрузка комментариев…";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--secondary);
      font-style: italic;
    }
    #telegram-widget-container iframe {
      max-width: 100%;
      border-radius: 8px;
    }
    @media (max-width: 600px) {
      .telegram-widget-wrapper {
        margin-top: 1rem;
        padding: 0.5rem 0;
      }
    }
  `

  return TelegramWidgetComponent
}

export default TelegramWidget

// quartz/components/TelegramWidget.tsx
import React from "react"
import {
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"
import { classNames } from "../util/lang"

interface TelegramWidgetOptions {
  channel: string
  limit?: number
}

const TelegramWidget: QuartzComponentConstructor<TelegramWidgetOptions> = (options) => {
  const { channel, limit = 5 } = options

  const TelegramWidgetComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const tgwidget = fileData.frontmatter?.tgwidget as boolean
    
    if (!tgwidget) return null

    return (
      <div className={classNames(displayClass, "telegram-widget-wrapper")}>
        <div id="telegram-widget-container">
          {/* Виджет будет вставлен сюда через JavaScript */}
        </div>
      </div>
    )
  }

  // Скрипт загрузки виджета с поддержкой темной темы
  TelegramWidgetComponent.afterDOMLoaded = `
    (function() {
      function isDark() {
        return document.documentElement.getAttribute("saved-theme") === "dark";
      }
      
      function loadTelegramWidget() {
        const container = document.getElementById("telegram-widget-container");
        if (!container) return;
        
        // Очищаем контейнер
        container.innerHTML = "";
        
        // Удаляем старые скрипты Telegram
        document.querySelectorAll('script[src*="telegram.org/js/telegram-widget.js"]').forEach(s => s.remove());
        
        // Создаем новый script элемент
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute("data-telegram-discussion", "${channel}");
        script.setAttribute("data-comments-limit", "${limit}");
        
        // Добавляем темную тему если нужно
        if (isDark()) {
          script.setAttribute("data-dark", "1");
        }
        
        container.appendChild(script);
      }
      
      // Инициализация
      function init() {
        loadTelegramWidget();
        
        // Слушаем изменение темы через кастомное событие
        window.addEventListener("themechange", loadTelegramWidget);
        
        // Также отслеживаем изменение атрибута saved-theme
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.attributeName === "saved-theme") {
              loadTelegramWidget();
            }
          });
        });
        
        observer.observe(document.documentElement, { 
          attributes: true,
          attributeFilter: ["saved-theme"]
        });
        
        // Слушаем навигацию в SPA
        document.addEventListener("nav", loadTelegramWidget);
      }
      
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
      } else {
        init();
      }
    })();
  `

  // CSS стили для виджета
  TelegramWidgetComponent.css = `
    .telegram-widget-wrapper {
      margin: 2rem 0;
      padding: 1rem 0;
      border-top: 1px solid var(--lightgray);
    }
    
    #telegram-widget-container {
      min-height: 200px;
      position: relative;
    }
    
    #telegram-widget-container:empty::before {
      content: "Загрузка комментариев Telegram…";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--secondary);
      font-style: italic;
    }
    
    /* Стили для iframe виджета */
    #telegram-widget-container iframe {
      max-width: 100%;
      border-radius: 8px;
    }
  `

  return TelegramWidgetComponent
}

export default TelegramWidget

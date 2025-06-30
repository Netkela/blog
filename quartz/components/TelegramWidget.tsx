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

  return ({ fileData, displayClass }: QuartzComponentProps) => {
    const tgwidget = fileData.frontmatter?.tgwidget as boolean
    
    if (!tgwidget) return null

    // Генерируем уникальный ID для контейнера
    const widgetId = `telegram-widget-${Math.random().toString(36).substr(2, 9)}`

    return (
      <>
        <div id={widgetId} className={classNames(displayClass, "telegram-widget-container")}>
          {/* Виджет будет вставлен сюда через JavaScript */}
        </div>
        
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Функция для создания виджета
              function createTelegramWidget(isDark) {
                const container = document.getElementById('${widgetId}');
                if (!container) return;
                
                // Очищаем контейнер
                container.innerHTML = '';
                
                // Создаем script элемент
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://telegram.org/js/telegram-widget.js?22';
                script.setAttribute('data-telegram-discussion', '${channel}');
                script.setAttribute('data-comments-limit', '${limit}');
                
                // Добавляем темную тему если нужно
                if (isDark) {
                  script.setAttribute('data-dark', '1');
                }
                
                container.appendChild(script);
              }
              
              // Определяем текущую тему
              function isDarkTheme() {
                return document.documentElement.getAttribute('data-theme') === 'dark';
              }
              
              // Создаем виджет при загрузке
              createTelegramWidget(isDarkTheme());
              
              // Отслеживаем изменение темы
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.attributeName === 'data-theme') {
                    createTelegramWidget(isDarkTheme());
                  }
                });
              });
              
              observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme']
              });
            })();
          `
        }} />
      </>
    )
  }
}

export default TelegramWidget

// quartz/components/TelegramWidget.tsx
import React from "react"
import {
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

// Конструктор Quartz-компонента
const TelegramWidget: QuartzComponentConstructor = () => {
  return ({ fileData }: QuartzComponentProps) => {
    // Получаем значение фронтмета
    const tgwidget = fileData.frontmatter?.tgwidget

    // Если tgwidget не включен — не отображаем ничего
    if (!tgwidget) return null

    // Иначе рендерим скрипт виджета
    return (
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-discussion="contest/198"
        data-comments-limit="5"
      ></script>
    )
  }
}

export default TelegramWidget

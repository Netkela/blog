// quartz/components/TelegramWidget.tsx
import React, { useState, useEffect } from "react"
import {
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

// Опции при инициализации компонента в layout
interface TelegramWidgetOptions {
  channel: string      // имя Telegram-канала, например "netkelago"
  limit?: number       // максимальное число комментариев (по умолчанию 5)
}

const TelegramWidget: QuartzComponentConstructor<TelegramWidgetOptions> = (options) => {
  const { channel, limit = 5 } = options

  return ({ fileData }: QuartzComponentProps) => {
    const tgwidget = fileData.frontmatter?.tgwidget as boolean
    if (!tgwidget) return null

    // Состояние определения текущей темы
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
      const updateTheme = () => {
        // Quartz сохраняет тему в localStorage и выставляет атрибут saved-theme на <html>
        const stored = localStorage.getItem("theme")
        const attr = document.documentElement.getAttribute("saved-theme")
        const theme = stored ?? attr ?? ""
        setIsDark(theme === "dark")
      }

      // Инициализируем сразу
      updateTheme()

      // Следим за изменениями темы и при навигации тоже (Quartz шлёт nav)
      document.addEventListener("themechange", updateTheme)
      document.addEventListener("nav", updateTheme)
      return () => {
        document.removeEventListener("themechange", updateTheme)
        document.removeEventListener("nav", updateTheme)
      }
    }, [])

    return (
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-discussion={channel}
        data-comments-limit={limit.toString()}
        // Добавляем атрибут data-dark="1" для тёмной темы
        {...(isDark ? { "data-dark": "1" } : {})}
      ></script>
    )
  }
}

export default TelegramWidget

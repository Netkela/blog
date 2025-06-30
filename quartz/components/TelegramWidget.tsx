// quartz/components/TelegramWidget.tsx
import React from "react"
import {
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

// Описание пропсов для вызова компонента
interface TelegramWidgetOptions {
  channel: string      // имя Telegram-канала, например "netkelago"
  limit?: number       // максимальное число комментариев, по умолчанию 5
}

// Конструктор Quartz-компонента
// Теперь принимает опции при вызове
const TelegramWidget: QuartzComponentConstructor<TelegramWidgetOptions> = (options) => {
  const { channel, limit = 5 } = options

  return (_props: QuartzComponentProps) => {
    // Если не передали обязательный канал — ничего не рендерим
    if (!channel) return null

    return (
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-discussion={channel}
        data-comments-limit={limit.toString()}
      ></script>
    )
  }
}

export default TelegramWidget

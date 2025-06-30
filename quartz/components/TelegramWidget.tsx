// quartz/components/TelegramWidget.tsx
import React from "react"
import {
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "./types"

// Пропсы при инициализации компонента в layout
interface TelegramWidgetOptions {
  channel: string      // имя Telegram-канала, например "netkelago"
  limit?: number       // максимальное число комментариев (по умолчанию 5)
}

// Конструктор Quartz-компонента
const TelegramWidget: QuartzComponentConstructor<TelegramWidgetOptions> = (options) => {
  const { channel, limit = 5 } = options

  return ({ fileData }: QuartzComponentProps) => {
    // Читаем tgwidget из frontmatter
    const tgwidget = fileData.frontmatter?.tgwidget as boolean
    
    // Если фронтмета нет или она false — не рендерим
    if (!tgwidget) return null

    // Дополнительно можно прочитать limit и channel из frontmatter,
    // если нужно сделать их настраиваемыми на странице:
    // const pageLimit = fileData.frontmatter?.tgLimit ?? limit
    // const pageChannel = fileData.frontmatter?.tgchannel ?? channel

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

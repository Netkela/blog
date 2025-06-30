import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      // Читаем флаг `dateoff`
      const hideDate = fileData.frontmatter?.dateoff ?? false
      // НОВОЕ ИЗМЕНЕНИЕ 1: Читаем флаг `readoff`
      const hideReadingTime = fileData.frontmatter?.readoff ?? false
      
      const segments: (string | JSX.Element)[] = []

      // Условие для даты
      if (fileData.dates && !hideDate) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // НОВОЕ ИЗМЕНЕНИЕ 2: Добавляем проверку на !hideReadingTime
      if (options.showReadingTime && !hideReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      // Не рендерим пустой <p> тег, если и дата, и время чтения отключены
      if (segments.length > 0) {
        return (
          <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
            {segments}
          </p>
        )
      } else {
        return null
      }
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor

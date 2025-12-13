import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"
import { i18n } from "../../i18n"
import { JSX } from "preact"
import style from "../styles/listPage.scss"

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree, cfg } = props
  const slug = fileData.slug ?? ""
  
  // Проверка, является ли это главной страницей
  const isIndex = slug === "index"
  
  if (isIndex) {
    // Получаем все файлы из папки notes/
    const allFiles = props.allFiles ?? []
    const noteFiles = allFiles
      .filter((file) => file.slug?.startsWith("notes/")) // Фильтруем только файлы из /notes/
      .filter((file) => file.slug !== "notes/index") // Исключаем индексную страницу папки
      .sort((a, b) => {
        // Сортируем по дате (новые первые)
        const dateA = a.dates?.created ?? new Date(0)
        const dateB = b.dates?.created ?? new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, 10) // Берём первые 10

    return (
      <article class={classNames(cfg?.displayClass, "popover-hint")}>
        {tree}
        
        <div class="recent-notes">
          <h2>Последние заметки</h2>
          <ul class="section-ul">
            {noteFiles.map((file) => {
              const title = file.frontmatter?.title ?? file.slug
              const dateStr = file.dates?.created?.toLocaleDateString("ru-RU") ?? ""
              
              return (
                <li class="section-li">
                  <div class="section">
                    <div class="desc">
                      <h3>
                        <a href={`../${file.slug}`} class="internal">
                          {title}
                        </a>
                      </h3>
                    </div>
                    {dateStr && <p class="meta">{dateStr}</p>}
                    {file.description && <p>{file.description}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </article>
    )
  }

  // Обычное отображение для всех других страниц
  return (
    <article class={classNames(cfg?.displayClass, "popover-hint")}>
      {tree}
    </article>
  )
}

Content.css = style
export default (() => Content) satisfies QuartzComponentConstructor

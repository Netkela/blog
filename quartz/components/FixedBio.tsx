// quartz/components/FixedBio.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// Интерфейс для опций компонента
interface Options {
  name: string // Ваше ФИО
  bio: string // Ваше описание как специалиста
  social?: { // Опциональные ссылки на соцсети
    twitter?: string
    github?: string
    linkedin?: string
    // Добавьте другие соцсети по необходимости
  }
  title?: string // Заголовок блока (по умолчанию "Об авторе")
}

export default ((opts: Options) => {
  // Проверяем, что обязательные опции предоставлены
  if (!opts.name || !opts.bio) {
    console.error("FixedBio: `name` and `bio` options are required.")
    // Возвращаем пустой компонент, чтобы не ломать сборку
    return () => <></>
  }

  const FixedBioComponent: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    // Проверяем Front Matter статьи для опции `showBio`
    // Если `showBio` явно установлено в `false`, то не отображаем блок
    // По умолчанию, если `showBio` не указано, блок отображается (или можно сделать наоборот)
    const showBio = fileData.frontmatter?.showBio ?? true // По умолчанию true, если не указано

    if (!showBio) {
      return <></>
    }

    const title = opts.title || "Об авторе"

    return (
      <div class={classNames(displayClass, "fixed-bio-container")}>
        <h2 class="fixed-bio-title">{title}: {opts.name}</h2>
        <div class="fixed-bio-content">
          <p class="fixed-bio-text">{opts.bio}</p>
          {opts.social && (
            <div class="fixed-bio-social-links">
              {opts.social.twitter && (
                <a href={opts.social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              )}
              {opts.social.github && (
                <a href={opts.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              )}
              {opts.social.linkedin && (
                <a href={opts.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
              {/* Добавьте другие соцсети по необходимости */}
            </div>
          )}
        </div>
      </div>
    )
  }

  // CSS для компонента
  FixedBioComponent.css = `
    .fixed-bio-container {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--lightgray);
      background-color: var(--background);
      padding-bottom: 1rem;
    }

    .fixed-bio-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .fixed-bio-content {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .fixed-bio-text {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--darkgray);
    }

    .fixed-bio-social-links {
      display: flex;
      gap: 1.2rem;
      margin-top: 0.5rem;

      a {
        color: var(--link);
        text-decoration: none;
        font-weight: 500;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 600px) {
      .fixed-bio-container {
        margin-top: 2rem;
        padding-top: 1rem;
      }
      .fixed-bio-title {
        font-size: 1.2rem;
      }
    }
  `

  return FixedBioComponent
}) satisfies QuartzComponentConstructor

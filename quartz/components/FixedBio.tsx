// quartz/components/FixedBio.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// Интерфейс для опций компонента
interface Options {
  name: string // Ваше ФИО
  bio: string // Ваше описание как специалиста
  social?: { // Опциональные ссылки на соцсети
    telegram?: string // Ссылка на Telegram
    vk?: string      // Ссылка на VK
    email?: string   // Email адрес (для mailto: ссылки)
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
    const showBio = fileData.frontmatter?.showBio ?? true

    if (!showBio) {
      return <></>
    }

    const title = opts.title || "Об авторе"

    return (
      <div class={classNames(displayClass, "fixed-bio-container")}>
        <h2 class="fixed-bio-title">{title}</h2>
        <p class="fixed-bio-name">{opts.name}</p>
        <div class="fixed-bio-content">
          <p class="fixed-bio-text">{opts.bio}</p>
          {opts.social && (
            <div class="fixed-bio-social-links">
              {opts.social.telegram && (
                <a href={opts.social.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
              )}
              {opts.social.vk && (
                <a href={opts.social.vk} target="_blank" rel="noopener noreferrer">VK</a>
              )}
              {opts.social.email && (
                // Для email используем mailto: протокол
                <a href={`mailto:${opts.social.email}`} target="_blank" rel="noopener noreferrer">Email</a>
              )}
              {/* Добавьте другие соцсети по необходимости */}
            </div>
          )}
        </div>
      </div>
    )
  }

  // CSS для компонента (оставляем без изменений, так как стили для ссылок общие)
  FixedBioComponent.css = `
    .fixed-bio-container {
      margin-top: 3rem;
      background-color: var(--background);
      padding: 1.5rem;
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .fixed-bio-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .fixed-bio-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 1rem;
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
        padding: 1rem;
      }
      .fixed-bio-title {
        font-size: 1.3rem;
      }
      .fixed-bio-name {
        font-size: 1rem;
      }
    }
  `

  return FixedBioComponent
}) satisfies QuartzComponentConstructor

// quartz/components/FixedBio.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// Интерфейс для опций компонента
interface Options {
  name: string // Ваше ФИО
  bio: string // Ваше описание как специалиста
  avatarSrc?: string // Добавлена опция для пути к аватарке
  social?: { // Опциональные ссылки на соцсети
    telegram?: string
    vk?: string
    email?: string
  }
}

export default ((opts: Options) => {
  // Проверяем, что обязательные опции предоставлены
  if (!opts.name || !opts.bio) {
    console.error("FixedBio: `name` and `bio` options are required.")
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

    return (
      <div class={classNames(displayClass, "fixed-bio-container")}>
        {opts.avatarSrc && (
          <div class="fixed-bio-avatar-wrapper">
            <img src={opts.avatarSrc} alt={opts.name} class="fixed-bio-avatar" />
          </div>
        )}
        <h3 class="fixed-bio-name">{opts.name}</h3>
        <div class="fixed-bio-content">
          <p class="fixed-bio-text">{opts.bio}</p>
          {opts.social && (
            <>
              {/* <p class="fixed-bio-social-heading">Связаться со мной:</p>  УДАЛЕНО */}
              <div class="fixed-bio-social-links">
                {opts.social.telegram && (
                  <a href={opts.social.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
                )}
                {opts.social.vk && (
                  <a href={opts.social.vk} target="_blank" rel="noopener noreferrer">VK</a>
                )}
                {opts.social.email && (
                  <a href={`mailto:${opts.social.email}`} target="_blank" rel="noopener noreferrer">Email</a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  FixedBioComponent.css = `
    .fixed-bio-container {
      margin-top: 2.5rem;
      margin-bottom: 2rem;
      background-color: var(--background);
      padding: 0.8rem 1rem;
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .fixed-bio-avatar-wrapper {
      margin-bottom: 0.5rem; /* Уменьшен отступ под аватаркой */
    }

    .fixed-bio-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--lightgray);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .fixed-bio-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      margin-top: 0.2rem;
      margin-bottom: 0.4rem; /* Уменьшен отступ под ФИО */
    }

    .fixed-bio-content {
      display: flex;
      flex-direction: column;
      gap: 0.4rem; /* Уменьшен зазор между элементами внутри контента */
      width: 100%;
    }

    .fixed-bio-text {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--darkgray);
      margin-bottom: 0.4rem; /* Уменьшен отступ между текстом био и кнопками соцсетей */
    }

    /* .fixed-bio-social-heading { УДАЛЕНО: Этот класс больше не нужен } */

    .fixed-bio-social-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.6rem; /* Уменьшен зазор между кнопками */
      margin-top: 0.2rem; /* Добавлен небольшой отступ сверху, чтобы отделить от текста био, если gap недостаточно */

      a {
        color: var(--link);
        text-decoration: none;
        font-weight: 500;
        padding: 0.2rem 0.5rem;
        font-size: 0.85rem;
        border: 1px solid var(--lightgray);
        border-radius: 4px;
        background-color: var(--code);
        &:hover {
          text-decoration: none;
          background-color: var(--highlight);
          border-color: var(--link);
        }
      }
    }

    @media (max-width: 600px) {
      .fixed-bio-container {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        padding: 0.6rem 0.8rem;
      }
      .fixed-bio-avatar {
        width: 70px;
        height: 70px;
      }
      .fixed-bio-avatar-wrapper {
        margin-bottom: 0.4rem;
      }
      .fixed-bio-name {
        font-size: 1rem;
        margin-bottom: 0.3rem;
      }
      .fixed-bio-text {
        font-size: 0.85rem;
        margin-bottom: 0.3rem;
      }
      /* .fixed-bio-social-heading { УДАЛЕНО } */
      .fixed-bio-social-links {
        gap: 0.5rem;
        margin-top: 0.1rem;
        a {
          padding: 0.15rem 0.4rem;
          font-size: 0.8rem;
        }
      }
    }
  `

  return FixedBioComponent
}) satisfies QuartzComponentConstructor

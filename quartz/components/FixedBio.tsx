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
        {/* Новый контейнер для текста и соцсетей */}
        <div class="fixed-bio-text-content">
          <div class="fixed-bio-name">{opts.name}</div>
          <p class="fixed-bio-text" dangerouslySetInnerHTML={{ __html: opts.bio }} />
          {opts.social && (
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

      display: flex; /* Делаем контейнер гибким */
      flex-direction: row; /* Элементы располагаются в ряд (аватарка и текстовый блок) */
      align-items: center; /* Выравниваем элементы по центру по вертикали */
      gap: 1rem; /* Промежуток между аватаркой и текстовым блоком */
    }

    .fixed-bio-avatar-wrapper {
      flex-shrink: 0; /* Аватарка не будет сжиматься */
    }

    .fixed-bio-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--lightgray);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .fixed-bio-text-content { /* Новый контейнер для текста и соцсетей */
      display: flex;
      flex-direction: column; /* Элементы внутри будут в колонку */
      flex-grow: 1; /* Разрешаем этому блоку занимать все доступное пространство */
    }

    .fixed-bio-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
      margin-top: 0; /* Убираем лишний отступ сверху */
      margin-bottom: 0.2rem; /* Уменьшен отступ под ФИО */
      text-align: left; /* Выравниваем по левому краю */
    }

    .fixed-bio-text {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--darkgray);
      margin-bottom: 0.3rem; /* Уменьшен отступ между текстом био и кнопками соцсетей */
      text-align: left; /* Выравниваем по левому краю */
    }

    a {
    color: var(--secondary);
    text-decoration: underline;
    &:hover {
      color: var(--tertiary);
    }
  }

    .fixed-bio-social-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start; /* Выравниваем кнопки по левому краю */
      gap: 0.6rem; /* Уменьшен зазор между кнопками */
      margin-top: 0.2rem; /* Небольшой отступ сверху, если нужно */

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
        flex-direction: column; /* На мобильных снова в колонку */
        align-items: center; /* Центрируем содержимое */
        text-align: center; /* Центрируем текст */
        gap: 0.1rem; /* Отступ между аватаркой и текстовым блоком */
        margin-top: 1.5rem;
        margin-bottom: 2rem; /* УВЕЛИЧЕННЫЙ ОТСТУП СНИЗУ ДЛЯ МОБИЛЬНЫХ */
        padding: 0.6rem 0.8rem;
      }
      .fixed-bio-avatar-wrapper {
        margin-bottom: 0;
      }
      .fixed-bio-avatar {
        width: 70px;
        height: 70px;
      }
      .fixed-bio-text-content {
        align-items: center;
      }
      .fixed-bio-name {
        font-size: 1rem;
        margin-top: 0;
        margin-bottom: 0.1rem;
        text-align: center;
      }
      .fixed-bio-text {
        font-size: 0.85rem;
        margin-bottom: 0.1rem;
        text-align: center;
      }
      .fixed-bio-social-links {
        justify-content: center;
        gap: 0.4rem;
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

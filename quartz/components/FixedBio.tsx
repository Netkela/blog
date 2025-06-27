// quartz/components/FixedBio.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

// Интерфейс для опций компонента
interface Options {
  name: string // Ваше ФИО
  bio: string // Ваше описание как специалиста
  social?: { // Опциональные ссылки на соцсети
    telegram?: string
    vk?: string
    email?: string
  }
  title?: string // Заголовок блока (по умолчанию "Об авторе")
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

    const title = opts.title || "Об авторе" // По умолчанию будет "Об авторе"

    return (
      <div class={classNames(displayClass, "fixed-bio-container")}>
        <h2 class="fixed-bio-title">{title}</h2>
        <p class="fixed-bio-name">{opts.name}</p>
        <div class="fixed-bio-content">
          <p class="fixed-bio-text">{opts.bio}</p>
          {opts.social && (
            <> {/* Используем Fragment для группировки, так как добавляем новый заголовок */}
              <h3 class="fixed-bio-social-heading">Связаться со мной:</h3> {/* Новый заголовок для соцсетей */}
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
      margin-top: 3rem; /* Внешний отступ сверху */
      margin-bottom: 2.5rem; /* Увеличиваем внешний отступ снизу */
      background-color: var(--background);
      padding: 1rem 1.5rem 1.5rem 1.5rem; /* Уменьшаем padding-top, сохраняем padding-right/left, увеличиваем padding-bottom */
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
      margin-bottom: 0.8rem; /* Отступ между текстом био и заголовком соцсетей */
    }

    .fixed-bio-social-heading {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      margin-top: 0.5rem; /* Отступ сверху для заголовка соцсетей */
      margin-bottom: 0.5rem; /* Отступ снизу для заголовка соцсетей */
    }

    .fixed-bio-social-links {
      display: flex;
      flex-wrap: wrap; /* Разрешаем перенос ссылок на новую строку на маленьких экранах */
      gap: 1.2rem;
      /* margin-top: 0.5rem; /* Этот отступ теперь регулируется fixed-bio-social-heading */

      a {
        color: var(--link);
        text-decoration: none;
        font-weight: 500;
        padding: 0.3rem 0.6rem; /* Добавляем внутренние отступы для кнопок */
        border: 1px solid var(--lightgray); /* Тонкая рамка для кнопок */
        border-radius: 4px; /* Немного скругленные углы для кнопок */
        background-color: var(--code); /* Легкий фон для кнопок */
        &:hover {
          text-decoration: none; /* Убираем подчеркивание при наведении, так как есть фон */
          background-color: var(--highlight); /* Изменяем фон при наведении */
          border-color: var(--link); /* Изменяем цвет рамки при наведении */
        }
      }
    }

    @media (max-width: 600px) {
      .fixed-bio-container {
        margin-top: 2rem;
        margin-bottom: 2rem; /* Уменьшаем отступ снизу на мобильных */
        padding: 0.8rem 1rem 1rem 1rem; /* Уменьшаем отступы на мобильных */
      }
      .fixed-bio-title {
        font-size: 1.3rem;
      }
      .fixed-bio-name {
        font-size: 1rem;
      }
      .fixed-bio-social-heading {
        font-size: 0.9rem;
      }
      .fixed-bio-social-links {
        gap: 0.8rem; /* Уменьшаем зазор между кнопками на мобильных */
      }
    }
  `

  return FixedBioComponent
}) satisfies QuartzComponentConstructor

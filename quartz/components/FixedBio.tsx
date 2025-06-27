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
  // title?: string // Заголовок блока больше не нужен, так как его убираем
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

    // Заголовок "Об авторе" или "Обо мне" убран, ФИО будет главным заголовком блока

    return (
      <div class={classNames(displayClass, "fixed-bio-container")}>
        <h3 class="fixed-bio-name">{opts.name}</h3> {/* ФИО теперь как заголовок */}
        <div class="fixed-bio-content">
          <p class="fixed-bio-text">{opts.bio}</p>
          {opts.social && (
            <>
              {/* Заголовок "Связаться со мной:" можно оставить или убрать, если хочется еще компактнее.
                  Пока оставим, но уменьшим его размер и отступы. */}
              <p class="fixed-bio-social-heading">Связаться со мной:</p> {/* Изменили на <p> для меньшего размера и отступов */}
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
      margin-top: 2.5rem; /* Немного уменьшим внешний отступ сверху */
      margin-bottom: 2rem; /* Немного уменьшим внешний отступ снизу */
      background-color: var(--background);
      padding: 0.8rem 1rem; /* Уменьшаем внутренние отступы сверху/снизу и по бокам */
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    /* .fixed-bio-title { Убираем этот класс, так как заголовок удален } */

    .fixed-bio-name {
      font-size: 1.05rem; /* Чуть меньше размер для ФИО */
      font-weight: 700;
      color: var(--text);
      margin-top: 0.2rem; /* Уменьшим отступ сверху */
      margin-bottom: 0.7rem; /* Уменьшим отступ снизу */
    }

    .fixed-bio-content {
      display: flex;
      flex-direction: column;
      gap: 0.6rem; /* Уменьшим зазор между элементами внутри контента */
    }

    .fixed-bio-text {
      font-size: 0.9rem; /* Меньший размер шрифта для основного текста */
      line-height: 1.5; /* Немного уменьшим межстрочный интервал */
      color: var(--darkgray);
      margin-bottom: 0.5rem; /* Уменьшим отступ между текстом био и заголовком соцсетей */
    }

    .fixed-bio-social-heading {
      font-size: 0.85rem; /* Меньший размер для заголовка соцсетей */
      font-weight: 600;
      color: var(--text);
      margin-top: 0.3rem; /* Уменьшим отступ сверху */
      margin-bottom: 0.3rem; /* Уменьшим отступ снизу */
    }

    .fixed-bio-social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem; /* Уменьшим зазор между кнопками */

      a {
        color: var(--link);
        text-decoration: none;
        font-weight: 500;
        padding: 0.2rem 0.5rem; /* Уменьшаем внутренние отступы для кнопок */
        font-size: 0.85rem; /* Уменьшаем размер текста на кнопках */
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
        margin-top: 1.5rem; /* Еще меньше на мобильных */
        margin-bottom: 1.5rem;
        padding: 0.6rem 0.8rem; /* Еще меньше отступы на мобильных */
      }
      .fixed-bio-name {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
      .fixed-bio-text {
        font-size: 0.85rem;
      }
      .fixed-bio-social-heading {
        font-size: 0.8rem;
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
      }
      .fixed-bio-social-links {
        gap: 0.6rem; /* Еще меньше зазор между кнопками на мобильных */
        a {
          padding: 0.15rem 0.4rem;
          font-size: 0.8rem;
        }
      }
    }
  `

  return FixedBioComponent
}) satisfies QuartzComponentConstructor

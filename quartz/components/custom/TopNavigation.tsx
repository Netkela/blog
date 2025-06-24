// quartz/components/custom/TopNavigation.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/path"
import { i18n } from "../../i18n"

// Определяем опции для нашего компонента: массив ссылок
interface TopNavOptions {
  links: {
    link: string
    text: string
  }[]
}

export default ((opts?: TopNavOptions) => {
  const TopNavigation: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, cfg } = props
    const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
    const links = opts?.links ?? []

    return (
      <header class="top-nav">
        {/* Ссылка-логотип, ведущая на главную страницу */}
        <a href="/" class="site-title">{title}</a>
        {/* Список навигационных ссылок */}
        <ul class="nav-links">
          {links.map((link) => (
            <li>
              <a href={link.link}>{link.text}</a>
            </li>
          ))}
        </ul>
      </header>
    )
  }

  // Стили для компонента (можете изменять под свой дизайн)
  TopNavigation.css = `
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--lightgray);
    margin-bottom: 2rem;
  }

  .site-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--dark);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: var(--dark);
    text-decoration: none;
    font-size: 1rem;
    padding-bottom: 0.25rem;
    border-bottom: 2px solid transparent;
    transition: border-color 0.3s ease;
  }
  
  .nav-links a:hover {
    border-color: var(--secondary);
  }
  `
  return TopNavigation
}) satisfies QuartzComponentConstructor

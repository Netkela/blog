// quartz/components/CustomMenu.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface MenuItem {
  title: string
  href: string
}

interface Options {
  title?: string
  items: MenuItem[]
}

export default ((opts?: Options) => {
  const CustomMenu: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    if (!opts?.items || opts.items.length === 0) {
      return <></>
    }

    return (
      <div class={classNames(displayClass, "custom-menu")}>
        <div class="custom-menu-header">
          <span class="heading">{opts.title || "Меню"}</span>
        </div>
        <nav class="custom-menu-nav">
          <ul class="custom-menu-list">
            {opts.items.map((item) => (
              <li class="custom-menu-item">
                <a href={item.href} class="custom-menu-link">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  CustomMenu.css = `
    .custom-menu {
      padding: 1rem;
      border-radius: 8px;
      background-color: var(--lightgray);
      margin-bottom: 1.5rem;
    }

    .custom-menu-header {
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--gray);
    }

    .custom-menu-link {
      display: block;
      padding: 0.5rem 0.75rem;
      color: var(--link);
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .custom-menu-link:hover {
      background-color: var(--highlight);
    }
  `

  return CustomMenu
}) satisfies QuartzComponentConstructor

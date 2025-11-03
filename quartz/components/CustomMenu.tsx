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
        <button
          type="button"
          class="custom-menu-toggle"
          aria-expanded="false"
          aria-controls="custom-menu-content"
        >
          <span class="heading">{opts.title || "Меню"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="chevron-icon"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <nav class="custom-menu-nav" id="custom-menu-content" aria-hidden="true">
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
      margin-bottom: 1.5rem;
      border-radius: 8px;
      overflow: hidden;
      background-color: var(--lightgray);
    }

    .custom-menu-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: var(--lightgray);
      border: 1px solid var(--gray);
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      color: var(--text);
      transition: all 0.2s ease;
    }

    .custom-menu-toggle:hover {
      background-color: var(--highlight);
    }

    .custom-menu-toggle .heading {
      margin: 0;
      font-size: 1rem;
    }

    .chevron-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    .custom-menu-toggle[aria-expanded="true"] .chevron-icon {
      transform: rotate(180deg);
    }

    .custom-menu-nav {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .custom-menu-toggle[aria-expanded="true"] ~ .custom-menu-nav {
      max-height: 500px;
    }

    .custom-menu-list {
      list-style: none;
      padding: 0.5rem 0;
      margin: 0;
    }

    .custom-menu-link {
      display: block;
      padding: 0.6rem 1rem;
      color: var(--link);
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .custom-menu-link:hover {
      background-color: var(--highlight);
      border-left-color: var(--link);
      color: var(--text);
    }

    @media (min-width: 768px) {
      .custom-menu-toggle {
        display: none;
      }

      .custom-menu-nav {
        max-height: none;
        overflow: visible;
      }

      .custom-menu-list {
        padding: 1rem 0;
      }
    }

    @media (max-width: 600px) {
      .custom-menu {
        margin-bottom: 1rem;
      }

      .custom-menu-link {
        padding: 0.5rem 0.8rem;
        font-size: 0.95rem;
      }
    }
  `

  CustomMenu.afterDOMLoaded = `
    document.querySelectorAll('.custom-menu-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        button.nextElementSibling?.setAttribute('aria-hidden', isExpanded);
      });

      const links = button.nextElementSibling?.querySelectorAll('a');
      links?.forEach(link => {
        link.addEventListener('click', () => {
          button.setAttribute('aria-expanded', 'false');
          button.nextElementSibling?.setAttribute('aria-hidden', 'true');
        });
      });
    });
  `

  return CustomMenu
}) satisfies QuartzComponentConstructor

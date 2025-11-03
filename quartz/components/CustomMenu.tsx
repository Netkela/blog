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
        {/* Иконка гамбургера */}
        <button
          type="button"
          class="custom-menu-toggle"
          aria-expanded="false"
          aria-label="Меню"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* Фон-оверлей */}
        <div class="custom-menu-overlay" id="custom-menu-overlay"></div>

        {/* Боковое меню справа */}
        <nav class="custom-menu-nav" id="custom-menu-content" aria-hidden="true">
          <button type="button" class="custom-menu-close" aria-label="Закрыть">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>

          <ul class="custom-menu-list">
            {opts.items.map((item) => (
              <li class="custom-menu-item">
                <a href={item.href} class="custom-menu-link">{item.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    )
  }

  CustomMenu.css = `
    .custom-menu { position: relative; }
    
    .custom-menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: var(--text);
      border-radius: 6px;
    }

    .custom-menu-toggle:hover {
      background-color: var(--highlight);
    }

    .custom-menu-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .custom-menu-overlay.active {
      opacity: 1;
    }

    .custom-menu-nav {
      position: fixed;
      top: 0;
      right: -100%;
      width: 280px;
      max-width: 80%;
      height: 100vh;
      background-color: var(--lightgray);
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      overflow-y: auto;
      transition: right 0.3s ease;
      padding: 1rem 0;
    }

    .custom-menu-nav.active {
      right: 0;
    }

    .custom-menu-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      margin: 0 1rem 1rem auto;
      padding: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: var(--text);
    }

    .custom-menu-close:hover {
      background-color: var(--highlight);
      border-radius: 6px;
    }

    .custom-menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .custom-menu-link {
      display: block;
      padding: 1rem 1.5rem;
      color: var(--link);
      text-decoration: none;
      border-left: 4px solid transparent;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .custom-menu-link:hover {
      background-color: var(--highlight);
      border-left-color: var(--link);
      padding-left: 1.75rem;
    }

    @media (min-width: 768px) {
      .custom-menu-toggle { display: none !important; }
      .custom-menu-overlay { display: none !important; }
      .custom-menu-nav {
        position: static;
        width: 100%;
        height: auto;
        background-color: transparent;
        box-shadow: none;
        right: auto;
        overflow-y: visible;
      }
      .custom-menu-close { display: none; }
      .custom-menu-link { padding: 0.6rem 0.75rem; }
    }
  `

  CustomMenu.afterDOMLoaded = `
    const toggle = document.querySelector('.custom-menu-toggle');
    const nav = document.querySelector('.custom-menu-nav');
    const overlay = document.querySelector('.custom-menu-overlay');
    const closeBtn = document.querySelector('.custom-menu-close');

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('active');
      overlay.classList.add('active');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      setTimeout(() => overlay.style.display = 'none', 300);
      document.body.style.overflow = 'auto';
    }

    toggle?.addEventListener('click', () => {
      toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    closeBtn?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);
    document.querySelectorAll('.custom-menu-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  `

  return CustomMenu
}) satisfies QuartzComponentConstructor

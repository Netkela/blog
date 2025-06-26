import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  website: string
  limit?: number
  pageIdEnabled?: boolean
  color?: string
  dislikes?: string
  outlined?: string
  colorful?: string
}

export default ((opts?: Options) => {
  const TelegramComments: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const websiteId = opts?.website || "s-0koNjl"
    const limit = opts?.limit || 5
    const pageIdEnabled = opts?.pageIdEnabled || true
    const color = opts?.color
    const dislikes = opts?.dislikes
    const outlined = opts?.outlined
    const colorful = opts?.colorful
    
    // Проверяем, отключены ли комментарии в frontmatter
    if (fileData.frontmatter?.comments === false) {
      return <></>
    }

    return (
      <div class={`telegram-comments ${displayClass ?? ""}`}>
        <div id="telegram-comments-container"></div>
      </div>
    )
  }

  TelegramComments.afterDOMLoaded = `
    document.addEventListener("nav", () => {
      const container = document.getElementById("telegram-comments-container");
      if (!container) return;

      // Очищаем контейнер при навигации (для SPA режима)
      container.innerHTML = "";

      // Проверяем, не загружен ли уже скрипт
      if (!document.querySelector('script[src*="comments.app"]')) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://comments.app/js/widget.js?3";
        script.setAttribute("data-comments-app-website", "${websiteId}");
        script.setAttribute("data-limit", "${limit}");
        ${pageIdEnabled ? 'script.setAttribute("data-page-id", window.location.pathname);' : ''}
        ${color ? `script.setAttribute("data-color", "${color}");` : ''}
        ${dislikes ? `script.setAttribute("data-dislikes", "${dislikes}");` : ''}
        ${outlined ? `script.setAttribute("data-outlined", "${outlined}");` : ''}
        ${colorful ? `script.setAttribute("data-colorful", "${colorful}");` : ''}
        
        container.appendChild(script);
      }
    });
  `

  TelegramComments.css = `
    .telegram-comments {
      margin-top: 2rem;
      padding: 1rem 0;
      border-top: 1px solid var(--lightgray);
    }
    
    #telegram-comments-container {
      width: 100%;
    }
  `

  return TelegramComments
}) satisfies QuartzComponentConstructor

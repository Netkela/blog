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
        <div 
          id="telegram-comments-container"
          data-website={websiteId}
          data-limit={limit.toString()}
          data-page-id-enabled={pageIdEnabled.toString()}
          data-color={color || ""}
          data-dislikes={dislikes || ""}
          data-outlined={outlined || ""}
          data-colorful={colorful || ""}
        ></div>
      </div>
    )
  }

  TelegramComments.afterDOMLoaded = `
    function loadTelegramComments() {
      const container = document.getElementById("telegram-comments-container");
      if (!container) return;

      // Очищаем контейнер при навигации
      container.innerHTML = "";

      // Получаем параметры из data-атрибутов
      const websiteId = container.getAttribute("data-website");
      const limit = container.getAttribute("data-limit");
      const pageIdEnabled = container.getAttribute("data-page-id-enabled") === "true";
      const color = container.getAttribute("data-color");
      const dislikes = container.getAttribute("data-dislikes");
      const outlined = container.getAttribute("data-outlined");
      const colorful = container.getAttribute("data-colorful");

      // Проверяем, не загружен ли уже скрипт
      const existingScript = document.querySelector('script[src*="comments.app"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Создаем новый скрипт
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://comments.app/js/widget.js?3";
      script.setAttribute("data-comments-app-website", websiteId);
      script.setAttribute("data-limit", limit);
      
      if (pageIdEnabled) {
        script.setAttribute("data-page-id", window.location.pathname);
      }
      
      if (color) {
        script.setAttribute("data-color", color);
      }
      
      if (dislikes) {
        script.setAttribute("data-dislikes", dislikes);
      }
      
      if (outlined) {
        script.setAttribute("data-outlined", outlined);
      }
      
      if (colorful) {
        script.setAttribute("data-colorful", colorful);
      }
      
      container.appendChild(script);
    }

    // Загружаем при первой загрузке страницы
    loadTelegramComments();

    // Загружаем при навигации (для SPA режима)
    document.addEventListener("nav", loadTelegramComments);
    
    // Добавляем cleanup для предотвращения утечек памяти
    window.addCleanup?.(() => {
      document.removeEventListener("nav", loadTelegramComments);
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

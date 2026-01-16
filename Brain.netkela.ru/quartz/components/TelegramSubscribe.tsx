// quartz/components/TelegramSubscribe.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface Options {
  channelUrl: string // URL телеграм-канала
  buttonText?: string // Текст кнопки (опционально)
  description?: string // Описание над кнопкой (опционально)
}

export default ((opts?: Options) => {
  // Значения по умолчанию
  const channelUrl = opts?.channelUrl || "https://t.me/netkela"
  const buttonText = opts?.buttonText || "Подписаться на Telegram"
  const description = opts?.description || "Получайте новые статьи и эксклюзивный контент первыми"

  const TelegramSubscribe: QuartzComponent = ({
    displayClass,
  }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "telegram-subscribe-container")}>
        {description && (
          <p class="telegram-subscribe-description">{description}</p>
        )}
        <a 
          href={channelUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          class="telegram-subscribe-button"
        >
          <svg 
            class="telegram-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          {buttonText}
        </a>
      </div>
    )
  }

  TelegramSubscribe.css = `
    .telegram-subscribe-container {
      margin: 2rem 0;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--lightgray) 0%, var(--light) 100%);
      border-radius: 12px;
      border: 1px solid var(--lightgray);
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .telegram-subscribe-description {
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--darkgray);
    }

    .telegram-subscribe-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #0088cc 0%, #0077b5 100%);
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #0077b5 0%, #006699 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 136, 204, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .telegram-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    @media (max-width: 600px) {
      .telegram-subscribe-container {
        margin: 1.5rem 0;
        padding: 1rem;
      }

      .telegram-subscribe-description {
        font-size: 0.9rem;
        margin-bottom: 0.8rem;
      }

      .telegram-subscribe-button {
        padding: 0.6rem 1.2rem;
        font-size: 0.95rem;
      }

      .telegram-icon {
        width: 20px;
        height: 20px;
      }
    }
  `

  return TelegramSubscribe
}) satisfies QuartzComponentConstructor

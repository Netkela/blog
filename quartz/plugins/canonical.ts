import React from "react"
import { QuartzPlugin } from "quartz"

export default function CanonicalPlugin(): QuartzPlugin {
  return {
    name: "add-canonical",
    // вызывается при генерации head
    externalResources({ cfg, fileData }) {
      // slug может быть "404" → корень
      const path = fileData.slug === "404" ? "" : `/${fileData.slug}`
      // cfg.baseUrl без протокола и без завершающего "/"
      const href = `https://${cfg.baseUrl.replace(/\/+$/, "")}${path}`

      return {
        css: [],
        js: [],
        additionalHead: [
          () => <link rel="canonical" href={href} />,
        ],
      }
    },
  }
}

// quartz/plugins/canonical.ts
import React from "react"
import { QuartzPlugin } from "quartz"

export default function CanonicalPlugin(): QuartzPlugin { // <--- ОБРАТИТЕ ВНИМАНИЕ НА export default
  return {
    name: "add-canonical",
    externalResources({ cfg, fileData }) {
      const path = fileData.slug === "404" ? "" : `/${fileData.slug}`
      // Проверяем, что cfg.baseUrl существует, прежде чем использовать replace
      const baseUrlCleaned = cfg.baseUrl ? cfg.baseUrl.replace(/\/+$/, "") : ""
      const href = `https://${baseUrlCleaned}${path}`

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

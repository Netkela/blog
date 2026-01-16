import { QuartzPlugin } from "quartz";
import React from "react";

export default function addCanonical(): QuartzPlugin {
  return {
    name: "add-canonical",
    externalResources({ cfg, fileData }) {
      // Формируем абсолютный URL страницы
      const slugPath = fileData.slug === "404" ? "" : `/${fileData.slug}`;
      const href = `https://${cfg.baseUrl}${slugPath}`;
      return {
        css: [],
        js: [],
        additionalHead: [
          () => <link rel="canonical" href={href} />
        ],
      };
    },
  };
}

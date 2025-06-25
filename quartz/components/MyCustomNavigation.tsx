// quartz/components/MyCustomNavigation.tsx
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function MyCustomNavigation({}: QuartzComponentProps) {
  return (
    <div>
      <h2>Мои Важные Разделы</h2>
      <ul>
        <li><a href="/path/to/folder-a">Папка А</a></li>
        <li><a href="/path/to/folder-c">Папка С</a></li>
        <li><a href="/another/specific/note">Конкретная Заметка</a></li>
      </ul>
    </div>
  )
}

MyCustomNavigation.css = `
  .my-custom-nav ul {
    list-style: none;
    padding-left: 0;
  }
  .my-custom-nav li {
    margin-bottom: 0.5em;
  }
`

export default (() => MyCustomNavigation) satisfies QuartzComponentConstructor

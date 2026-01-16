import { QuartzComponent, QuartzComponentConstructor } from "./types"

interface Options {
  counterId: string
  enableClickmap?: boolean
  enableTrackLinks?: boolean  
  enableAccurateTrackBounce?: boolean
  enableWebvisor?: boolean
}

export default ((opts?: Options) => {
  const YandexMetrika: QuartzComponent = () => {
    if (!opts?.counterId) {
      return null
    }

    return (
      <>
        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              
              ym(${opts.counterId}, "init", {
                clickmap: ${opts.enableClickmap ?? true},
                trackLinks: ${opts.enableTrackLinks ?? true},
                accurateTrackBounce: ${opts.enableAccurateTrackBounce ?? true},
                webvisor: ${opts.enableWebvisor ?? true}
              });
            `
          }}
        />
        <noscript>
          <div>
            <img 
              src={`https://mc.yandex.ru/watch/${opts.counterId}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
      </>
    )
  }

  return YandexMetrika
}) satisfies QuartzComponentConstructor<Options>

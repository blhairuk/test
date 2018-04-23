import {join} from 'path'
import * as React from 'react'
import {renderToString} from 'react-dom/server'

export default ({
  assetName,
  Component
}) => ctx => {
  const scriptSrc = join(process.env.APP_PROXY_PATH, `./static/${assetName}.js`)
  const app = renderToString(<Component />)

  ctx.body = `
<div>
  <div id="app">${app}</div>
  <script src="${scriptSrc}" async=""></script>
</div>`
  ctx.type = 'application/liquid'
}
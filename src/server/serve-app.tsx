import {join} from 'path'
import * as React from 'react'
import {renderToString} from 'react-dom/server'

export default ({
  assetName,
  Component
}) => async ctx => {
  const scriptSrc = join(
    process.env.APP_PROXY_PATH, 
    `./static/${assetName}.js`
  )

  const props = typeof Component.getInitialProps !== 'undefined' ? 
    await Component.getInitialProps(ctx) : 
    {}

  const app = renderToString(<Component {...props} />)

  ctx.body = `
<div class="page-width">
  <div id="app">${app}</div>
  <script src="${scriptSrc}" async=""></script>
</div>`
  ctx.type = 'application/liquid'
}
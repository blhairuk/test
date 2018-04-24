import {join} from 'path'
import * as React from 'react'
import {renderToString} from 'react-dom/server'

export default ({
  assetName,
  getInitialProps,
  Component
}) => async ctx => {
  const scriptSrc = join(
    process.env.APP_PROXY_PATH, 
    `./static/${assetName}.js`
  )
  
  const props = getInitialProps ? await getInitialProps(ctx) : {}
  const app = renderToString(<Component {...props} />)

  ctx.body = `
<div class="page-width">
  <div id="app">${app}</div>
  <script src="${scriptSrc}" async=""></script>
  <script type="text/javascript">var AppProps = ${JSON.stringify(props)};</script>
</div>`
  ctx.type = 'application/liquid'
}
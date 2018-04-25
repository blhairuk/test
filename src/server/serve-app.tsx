import * as React from 'react'
import {renderToString} from 'react-dom/server'
import {ServerStyleSheet} from 'styled-components'

const {APP_PROXY_PATH} = process.env

export default ({
  assetName,
  getInitialProps,
  Component
}) => async ctx => {
  const scriptSrc = `${APP_PROXY_PATH}/static/${assetName}.js`
  
  const props = getInitialProps ? await getInitialProps(ctx) : {}
  const sheet = new ServerStyleSheet()
  const app = renderToString(sheet.collectStyles(<Component {...props} />))
  const styleTags = sheet.getStyleTags()

  ctx.body = `
<div class="page-width">
  <div id="app">${app}</div>
  ${styleTags}
  <script src="${scriptSrc}" async=""></script>
  <script type="text/javascript">var AppProps = ${JSON.stringify(props)};</script>
</div>`
  ctx.type = 'application/liquid'
}
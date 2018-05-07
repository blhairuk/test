import * as React from 'react'
import {renderToString} from 'react-dom/server'
import {ServerStyleSheet} from 'styled-components'

import assetCacheKey from './asset-cache-key'

const {APP_PROXY_PATH} = process.env

const scriptSrc = assetName => `${APP_PROXY_PATH}/static/${assetName}.js`

export default ({
  assetName,
  getInitialProps,
  Component
}) => async ctx => {  
  const props = getInitialProps ? await getInitialProps(ctx) : {}
  const sheet = new ServerStyleSheet()
  const app = renderToString(sheet.collectStyles(<Component {...props} />))
  const styleTags = sheet.getStyleTags()

  ctx.body = `
<div class="page-width">
  <div id="app">${app}</div>
  ${styleTags}
  <script src="${scriptSrc(assetName)}?v=${assetCacheKey}" async=""></script>
  <script src="${scriptSrc('commons')}?v=${assetCacheKey}" async=""></script>
  <script type="text/javascript">var AppProps = ${JSON.stringify(props)};</script>
</div>`
  ctx.type = 'application/liquid'
}
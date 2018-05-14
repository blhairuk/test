import * as React from "react"
import {renderToString} from "react-dom/server"
import {ServerStyleSheet} from "styled-components"

import assetCacheKey from "./helpers/asset-cache-key"

const {
  APP_PROXY_PATH,
  NODE_ENV,
} = process.env

const scriptHost = NODE_ENV === "development" ? "//localhost:8080" : APP_PROXY_PATH
const scriptSrc = (assetName) => `${scriptHost}/static/${assetName}.js`

export default (appPath) => async (ctx) => {
  const [
    {default: Component},
    {default: getInitialProps},
  ] = await Promise.all([
    import(`../client/${appPath}/app`),
    import(`./get-initial-props/${appPath}`),
  ])

  const props = await getInitialProps(ctx)

  const sheet = new ServerStyleSheet()
  const app = renderToString(sheet.collectStyles(<Component {...props} />))
  const styleTags = sheet.getStyleTags()

  ctx.body = `
<div class="page-width">
  <div id="app">${app}</div>
  ${styleTags}
  <script src="${scriptSrc(appPath)}?v=${assetCacheKey}" async=""></script>
  <script type="text/javascript">
    var AppProps = ${JSON.stringify(props)};
    var Customer = {
      "email": "{{ customer.email }}",
      "firstName": "{{ customer.first_name }}"
    };
  </script>
</div>`
  ctx.type = "application/liquid"
}

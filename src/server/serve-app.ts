import {join} from 'path'

export default assetName => ctx => {
  const scriptSrc = join(process.env.APP_PROXY_PATH, `./static/${assetName}.js`)

  ctx.body = `
<div>
  <div id="app"></div>
  <script src="${scriptSrc}" async=""></script>
</div>`
  ctx.type = 'application/liquid'
}
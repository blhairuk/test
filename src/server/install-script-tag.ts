import assetCacheKey from './asset-cache-key'
import {shopifyApi} from './fetch'

const {APP_PROXY_HOST} = process.env

export default async ({shop, token}) => {
  const options = {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
  }

  const srcPath = '/static/theme.bundle.js'
  const src = `${APP_PROXY_HOST}${srcPath}?v=${assetCacheKey}`

  const {script_tags} = await shopifyApi(shop, '/script_tags.json', {
    ...options,
    method: 'GET'
  })

  for (const scriptTag of script_tags) {
    if (scriptTag.src.includes(srcPath)) {
      await shopifyApi(shop, `/script_tags/${scriptTag.id}.json`, {
        ...options,
        method: 'DELETE'
      })
    }
  }

  await shopifyApi(shop, '/script_tags.json', {
    ...options,
    body: JSON.stringify({
      script_tag: {
        event: 'onload',
        src,
      }
    }),
    method: 'POST',
  })
}
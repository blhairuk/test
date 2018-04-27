import fetch from './shopify-api-fetch'

const {APP_PROXY_HOST} = process.env

export default async ({shop, token}) => {
  const options = {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
  }

  const src = `${APP_PROXY_HOST}/static/theme.bundle.js`

  const {script_tags: scriptTags} = await fetch(shop, '/script_tags.json', {
    ...options,
    method: 'GET'
  })

  for (const scriptTag of scriptTags) {
    if (scriptTag.src === src) {
      await fetch(shop, `/script_tags/${scriptTag.id}.json`, {
        ...options,
        method: 'DELETE'
      })
    }
  }

  await fetch(shop, '/script_tags.json', {
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
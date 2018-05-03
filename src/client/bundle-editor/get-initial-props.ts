import * as Shopify from 'shopify-api-node'

import {
  BUNDLE_ADD_ON_TAG,
  BUNDLE_PRODUCT_TAG,
  BUNDLE_TYPE,
} from '../../shop'

import {getToken} from '../../server/db'

export default async ctx => {
  const accessToken = await getToken(ctx.query.shop)

  const shopify = new Shopify({
    shopName: ctx.query.shop,
    accessToken
  })
  
  const products = await shopify.product.list({limit: 250})

  const bundleAddOns = products.filter(p => p.tags.includes(BUNDLE_ADD_ON_TAG))
  const bundleProduct = products.find(p => p.product_type === BUNDLE_TYPE)
  const bundleProducts = products.filter(p => p.tags.includes(BUNDLE_PRODUCT_TAG))

  const bundleProductMetafields = await shopify.metafield.list({
    metafield: {
      owner_resource: 'product',
      owner_id: bundleProduct.id,
    }
  })

  const query = Object.assign({}, ctx.query, {
    path_prefix: undefined,
    shop: undefined,
    signature: undefined,
    timestamp: undefined,
  })

  return {
    bundleAddOns,
    bundleProduct,
    bundleProductMetafields,
    bundleProducts,
    query,
  }
}
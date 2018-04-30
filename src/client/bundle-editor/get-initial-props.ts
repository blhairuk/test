import * as Shopify from 'shopify-api-node'

import {
  BUNDLE_ADD_ON_TYPE,
  BUNDLE_PARENT_TYPE,
  BUNDLE_PRODUCT_TYPE,
} from '../../shop'

import {getToken} from '../../server/db'

export default async ctx => {
  const accessToken = await getToken(ctx.query.shop)

  const shopify = new Shopify({
    shopName: ctx.query.shop,
    accessToken
  })

  const [
    bundleAddOns,
    [bundleProduct],
    bundleProducts
  ] = await Promise.all([
    shopify.product.list({product_type: BUNDLE_ADD_ON_TYPE}),
    shopify.product.list({product_type: BUNDLE_PARENT_TYPE}),
    shopify.product.list({product_type: BUNDLE_PRODUCT_TYPE}),
  ])

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
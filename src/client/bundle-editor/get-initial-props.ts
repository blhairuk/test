import * as Shopify from 'shopify-api-node'

import {getToken} from '../../server/db'

const collectionId = parseInt(process.env.BUNDLE_COLLECTION_ID)
const productId = parseInt(process.env.BUNDLE_PRODUCT_ID)

export default async ctx => {
  const accessToken = await getToken(ctx.query.shop)

  const shopify = new Shopify({
    shopName: ctx.query.shop,
    accessToken
  })

  const metafieldListParams = {
    metafield: {
      owner_resource: 'product',
      owner_id: productId,
    }
  }

  let [
    collection,
    collects,
    product,
    productMetafields,
    products
  ] = await Promise.all([
    shopify.smartCollection.get(collectionId),
    shopify.collect.list({collection_id: collectionId}),
    shopify.product.get(productId),
    shopify.metafield.list(metafieldListParams),
    shopify.product.list({collection_id: collectionId}),
  ])

  products = products.sort((a, b) => {
    const aSortValue = collects
      .find(c => c.product_id === a.id)
      .position 
    const bSortValue = collects
      .find(c => c.product_id === b.id)
      .position
    return aSortValue < bSortValue ? -1 : 1
  })

  return {
    collection,
    product,
    productMetafields,
    products
  }
}
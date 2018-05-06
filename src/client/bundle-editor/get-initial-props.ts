import * as Shopify from 'shopify-api-node'

import {
  BUNDLE_ADD_ON_TAG,
  BUNDLE_PRODUCT_TAG,
  BUNDLE_TYPE,
} from '../../shop'

import {getToken} from '../../server/db'
import {rechargeApi} from '../../server/fetch'
import {isBundleIdInProperties} from '../../helpers'

export default async ({
  params: {
    bundleId: bundleIdS,
    customerHash,
  }, 
  query: {
    shop: shopName,
  },
}) => {
  const accessToken = await getToken(shopName)
  const bundleId = parseInt(bundleIdS)

  const shopify = new Shopify({
    shopName,
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

  let subscriptions
  if (customerHash && bundleId) {
    const customerId = (await rechargeApi(`/customers?hash=${customerHash}`))[0].id
    subscriptions = 
      (await rechargeApi(`/subscriptions?customer_id=${customerId}&limit=250&status=ACTIVE`))
      .filter(({properties}) => isBundleIdInProperties(bundleId, properties))
  }

  return {
    bundleAddOns,
    bundleId,
    bundleProduct,
    bundleProductMetafields,
    bundleProducts,
    customerHash,
    subscriptions,
  }
}
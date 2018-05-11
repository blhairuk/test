import * as Shopify from "shopify-api-node"

import {
  BUNDLE_ADD_ON_TAG,
  BUNDLE_PRODUCT_TAG,
  BUNDLE_TYPE,
} from "../../shared/constants"

import {isBundleIdInProperties} from "../../shared/helpers"
import {getToken} from "../db"

import {
  getCustomer,
  getSubscriptions,
} from "../apis/recharge"

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
    accessToken,
  })

  const products = await shopify.product.list({limit: 250})

  const bundleAddOns = products.filter((p) => p.tags.includes(BUNDLE_ADD_ON_TAG))
  const bundleProduct = products.find((p) => p.product_type === BUNDLE_TYPE)
  const bundleProducts = products.filter((p) => p.tags.includes(BUNDLE_PRODUCT_TAG))

  const bundleProductMetafields = await shopify.metafield.list({
    metafield: {
      owner_resource: "product",
      owner_id: bundleProduct.id,
    },
  })

  let subscriptions
  if (customerHash && bundleId) {
    const customerId = (await getCustomer(customerHash)).id
    subscriptions = (await getSubscriptions({customerId, status: "ACTIVE"}))
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

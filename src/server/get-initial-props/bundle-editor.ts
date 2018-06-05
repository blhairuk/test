import {
  BUNDLE_ADD_ON_TAG,
  BUNDLE_PRODUCT_TAG,
  BUNDLE_TYPE,
} from "../../shared/constants"

import {isBundleIdInProperties} from "../../shared/helpers"

import {
  getCustomer,
  getSubscriptions,
} from "../apis/recharge"

import Shopify from "../apis/shopify"

export default async ({
  params: {
    bundleId: bundleIdS,
    shopifyCustomerId,
  },
  query: {
    shop: shopName,
  },
}) => {
  const bundleId = parseInt(bundleIdS, 10)

  const shopify = await Shopify(shopName)
  const products = await shopify.product.list({limit: 250})
  const bundleAddOns = products.filter((p) => p.tags.includes(BUNDLE_ADD_ON_TAG))
  const bundleProduct = products.find((p) => p.product_type === BUNDLE_TYPE)
  const bundleProducts = products.filter((p) => p.tags.includes(BUNDLE_PRODUCT_TAG))

  const bundleProductMetafields = await shopify.metafield.list({
    metafield: {
      owner_id: bundleProduct.id,
      owner_resource: "product",
    },
  })

  let subscriptions
  if (shopifyCustomerId && bundleId) {
    const customerId = (await getCustomer(shopifyCustomerId)).id
    subscriptions = (await getSubscriptions({customerId, status: "ACTIVE"}))
      .filter(({properties}) => isBundleIdInProperties(bundleId, properties))
  }

  return {
    bundleAddOns,
    bundleId,
    bundleProduct,
    bundleProductMetafields,
    bundleProducts,
    shopifyCustomerId,
    subscriptions,
  }
}

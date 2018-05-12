import * as Shopify from "shopify-api-node"

import {
  getCustomer,
  getSubscriptions,
} from "../../apis/recharge"

import {
  createIdQuantities,
  findProductByVariantId,
  isBundleIdInProperties,
} from "../../../shared/helpers"

import {
  cancel as cancelBundle,
  create as createBundle,
} from "../../bundles"

import {getToken} from "../../db"

export default () => async (ctx) => {
  const {
    params: {
      bundleId: bundleIdS,
      customerHash,
    },
    query: {
      shop: shopName,
    },
  } = ctx

  const {
    add_on_ids,
    bundle_name,
    customer_name,
    email,
    frequency,
    size: sizeI,
    variant_ids,
  } = ctx.request.body

  const bundleId = parseInt(bundleIdS, 10)
  const size = `${sizeI}`
  const accessToken = await getToken(shopName)

  const shopify = new Shopify({
    accessToken,
    shopName,
  })

  const idQuantities = createIdQuantities(variant_ids.concat(add_on_ids))
  const products = await shopify.product.list({limit: 250})

  const customer = await getCustomer(customerHash)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: "ACTIVE"}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))

  const {
    address_id,
    charge_interval_frequency,
    next_charge_scheduled_at,
    order_interval_unit,
  } = subscriptions[0]

  const bundleVariantId = products
    .find(({product_type}) => product_type === "Bundle")
    .variants
    .find(({option1}) => option1 === size)
    .id

  await cancelBundle(subscriptions.map(({id}) => id))

  const newSubscriptionsData = Object.entries(idQuantities)
    .concat([[`${bundleVariantId}`, 1]])
    .map(([idS, quantity]) => {
      const id = parseInt(idS, 10)
      const product = findProductByVariantId(products, id)
      const variant = product.variants.find((v) => v.id === id)

      return {
        address_id,
        charge_interval_frequency,
        next_charge_scheduled_at,
        order_interval_frequency: frequency,
        order_interval_unit,
        price: variant.price,
        product_title: product.title,
        properties: id === bundleVariantId ? {
          bundle_customer_name: customer_name,
          bundle_email: email,
          bundle_name,
        } : undefined,
        quantity,
        shopify_product_id: product.id,
        shopify_variant_id: id,
      }
    })

  await createBundle(newSubscriptionsData)

  ctx.status = 204
}

import * as Shopify from 'shopify-api-node'

import {rechargeApi} from '../fetch'
import {
  createIdQuantities,
  findProductByVariantId,
  isBundleIdInProperties,
} from '../../helpers'
import {getToken} from '../../server/db'

export default () => async ctx => {
  const {
    params: {
      bundleId: bundleIdS,
      customerHash,
    },
    query: {
      shop: shopName,
    }
  } = ctx

  const {
    add_on_ids,
    frequency,
    size: sizeI,
    variant_ids,
  } = ctx.request.body

  const bundleId = parseInt(bundleIdS)
  const size = `${sizeI}`
  const accessToken = await getToken(shopName)

  const shopify = new Shopify({
    shopName,
    accessToken
  })

  const idQuantities = createIdQuantities(variant_ids.concat(add_on_ids))
  const products = await shopify.product.list({limit: 250})

  const customer = (await rechargeApi(`/customers?hash=${customerHash}`))[0]
  const subscriptions = (await rechargeApi(`/subscriptions?customer_id=${customer.id}&status=ACTIVE`))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))

  const {
    address_id, 
    charge_interval_frequency,
    next_charge_scheduled_at, 
    order_interval_unit
  } = subscriptions[0]

  const bundleVariantId = products
    .find(({product_type}) => product_type === 'Bundle')
    .variants
    .find(({option1}) => option1 === size)
    .id

  try {
    await Promise.all(subscriptions.map(({id}) => (
      rechargeApi(`/subscriptions/${id}/cancel`, {
        body: JSON.stringify({
          cancellation_reason: 'automated, editing bundle subscription',
        }),
        method: 'POST'
      })
    )))
  } catch (err) {
    console.error(err)
  }

  try {
    await Promise.all(Object.entries(idQuantities).concat([[`${bundleVariantId}`, 1]]).map(([idS, quantity]) => {
      const id = parseInt(idS)
      const product = findProductByVariantId(products, id)
      const variant = product.variants.find(v => v.id === id)

      const data = {
        address_id,
        charge_interval_frequency,
        next_charge_scheduled_at,
        order_interval_frequency: frequency,
        order_interval_unit,
        price: variant.price,
        product_title: product.title,
        properties: {
          bundle_id: bundleId
        },
        quantity,
        shopify_product_id: product.id,
        shopify_variant_id: id,
      }

      return rechargeApi(`/subscriptions`, {
        body: JSON.stringify(data),
        method: 'POST',
      })
    }))
  } catch (err) {
    console.error(err)
  }

  ctx.status = 204
}
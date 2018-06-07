import {StaticRouter} from "react-router"

import Shopify from "../apis/shopify"
import stripeApi from "../apis/stripe"

import {
  getAddress,
  getCustomer,
  getSubscriptions,
  getUpcomingCharges,
} from "../apis/recharge"

import {groupSubscriptionsIntoBundles} from "../../shared/helpers"

const {
  APP_PROXY_PATH,
} = process.env

export default async (ctx) => {
  const {
    id,
    shopifyCustomerId,
    page,
  } = ctx.params

  const {shop: shopName} = ctx.query

  const shopify = await Shopify(shopName)
  const customer: ShopifyCustomer = await shopify.customer.get(shopifyCustomerId)
  const data: any = {customer}

  const rechargeCustomer = ["billing", "my-box", "edit-address"].includes(page)
    ? await getCustomer(shopifyCustomerId)
    : null

  switch (page) {
    case "billing":
      data.stripeCustomer = await stripeApi(`/customers/${rechargeCustomer.stripe_customer_token}`)
      break

    case "my-box":
      const subscriptions = await getSubscriptions({
        customerId: rechargeCustomer.id,
        status: "ACTIVE",
      })
      data.bundles = groupSubscriptionsIntoBundles(subscriptions)

      const productIds = Array.from(new Set(subscriptions.map(({shopify_product_id}) => shopify_product_id)))
      const addressIds = Array.from(new Set(subscriptions.map(({address_id}) => address_id)))

      const [products, addresses, charges] = await Promise.all([
        productIds.length ? shopify.product.list({ids: productIds.join(",")}) : [],
        addressIds.length ? Promise.all(addressIds.map((addressId) => getAddress(addressId))) : [],
        getUpcomingCharges(subscriptions[0].id),
      ])
      data.products = products
      data.addresses = addresses
      data.charges = charges
      break

    case "orders":
      if (id) {
        data.order = await shopify.order.get(id)
      } else {
        data.orders = await shopify.order.list({customer_id: customer.id})
      }
      break

    case "edit-address":
      data.address = await getAddress(ctx.query.address_id)
      break
  }

  return {
    Router: StaticRouter,
    data,
    routerProps: {
      context: {},
      location: `${APP_PROXY_PATH}${ctx.request.path}`,
    },
  }
}

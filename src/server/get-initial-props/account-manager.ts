import {StaticRouter} from "react-router"

import Shopify from "../apis/shopify"

import {
  getAddress,
  getCustomer,
  getSubscriptions,
} from "../apis/recharge"

import {groupSubscriptionsIntoBundles} from "../../shared/helpers"

const {
  APP_PROXY_PATH,
} = process.env

export default async (ctx) => {
  const {
    shopifyCustomerId,
    page,
  } = ctx.params

  const {shop: shopName} = ctx.query

  const shopify = await Shopify(shopName)
  const customer: ShopifyCustomer = await shopify.customer.get(shopifyCustomerId)
  const data: any = {customer}

  switch (page) {
    case "my-box":
      const rechargeCustomer = await getCustomer(shopifyCustomerId)
      const subscriptions = await getSubscriptions({
        customerId: rechargeCustomer.id,
        status: "ACTIVE",
      })
      data.bundles = groupSubscriptionsIntoBundles(subscriptions)

      const productIds = Array.from(new Set(subscriptions.map(({shopify_product_id}) => shopify_product_id)))
      const addressIds = Array.from(new Set(subscriptions.map(({address_id}) => address_id)))

      const [products, addresses] = await Promise.all([
        productIds.length ? shopify.product.list({ids: productIds.join(",")}) : [],
        addressIds.length ? Promise.all(addressIds.map((addressId) => getAddress(addressId))) : [],
      ])
      data.products = products
      data.addresses = addresses

      break
    case "orders":
      data.orders = await shopify.order.list({customer_id: customer.id})
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

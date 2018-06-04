import {StaticRouter} from "react-router"

import Shopify from "../apis/shopify"

import {
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

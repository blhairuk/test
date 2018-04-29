import {resolve} from 'url'
import {StaticRouter} from 'react-router'
import * as Shopify from 'shopify-api-node'

import {
  rechargeApi,
  stripeApi,
} from '../../server/fetch'
import {getToken} from '../../server/db'

const {
  APP_PROXY_PATH,
} = process.env

export default async ctx => {
  const {
    customerHash,
    page
  } = ctx.params

  const customer = (await rechargeApi(`/customers?hash=${customerHash}`))[0]
  const data: any = {customer}
  const location = `${APP_PROXY_PATH}${ctx.request.path}`

  switch (page) {
    case 'billing':
      data.stripeCustomer = await stripeApi(`/customers/${customer.stripe_customer_token}`)
      break
    case 'history':
      data.orders = await rechargeApi(`/orders?customer_id=${customer.id}`)
      break
    case 'subscriptions':
      [data.subscriptions, data.addresses] = await Promise.all([
        rechargeApi(`/subscriptions?customer_id=${customer.id}`),
        rechargeApi(`/customers/${customer.id}/addresses`),
      ])
      break
  }

  return {
    customerHash,
    data,
    Router: StaticRouter,
    routerProps: {
      location,
      context: {},
    },
  }
}
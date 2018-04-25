import * as fetch from 'node-fetch'
import {StaticRouter} from 'react-router'
import * as Shopify from 'shopify-api-node'

import {getToken} from '../../server/db'

const rechargeApiToken = process.env.RECHARGE_API_TOKEN

const rechargeApi = async path => {
  const res = await fetch(`https://api.rechargeapps.com${path}`, {
    headers: {
      'content-type': 'application/json',
      'x-recharge-access-token': rechargeApiToken,
    }
  })
  return res.json()
}

export default async ctx => {
  const {customerHash} = ctx.params

  const customer = (await rechargeApi(`/customers?hash=${customerHash}`)).customers[0]
  const subscriptions = (await rechargeApi(`/subscriptions?customer_id=${customer.id}`)).subscriptions
  const data = {
    customer,
    subscriptions
  }

  return {
    data,
    Router: StaticRouter,
    routerProps: {
      location: ctx.request.path,
      context: {},
    },
  }
}
import {format as formatDate} from "date-fns"
import {StaticRouter} from "react-router"

import rechargeApi, {
  getCustomer,
  getSubscriptions,
} from "../apis/recharge"

import stripeApi from "../apis/stripe"

const {
  APP_PROXY_PATH,
} = process.env

export default async (ctx) => {
  const {
    customerHash,
    page,
  } = ctx.params

  const customer = await getCustomer(customerHash)
  const data: any = {customer}
  const location = `${APP_PROXY_PATH}${ctx.request.path}`

  switch (page) {
    case "billing":
      [
        data.stripeCustomer,
      ] = await Promise.all([
        stripeApi(`/customers/${customer.stripe_customer_token}`),
      ])
      break
    case "schedule":
      const dateMin = formatDate(new Date(), "YYYY-MM-DD")
      data.charges = await rechargeApi(`/charges?customer_id=${customer.id}&date_min=${dateMin}`)
      break
    case "subscriptions":
      [
        data.subscriptions,
        data.addresses,
      ] = await Promise.all([
        getSubscriptions({customerId: customer.id}),
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

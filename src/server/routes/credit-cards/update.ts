import {URLSearchParams} from "url"

import {
  getCustomer,
} from "../../apis/recharge"

import stripeApi from "../../apis/stripe"

export default () => async (ctx) => {
  const {
    params: {
      shopifyCustomerId,
    },
    request: {
      body: {token},
    },
  } = ctx

  const rechargeCustomer = await getCustomer(shopifyCustomerId)
  const stripeCustomerId = rechargeCustomer.stripe_customer_token

  const createSourceBody = new URLSearchParams()
  createSourceBody.append("source", token)
  const source = await stripeApi(`/customers/${stripeCustomerId}/sources`, {
    body: createSourceBody,
    method: "POST",
  })

  const defaultSourceBody = new URLSearchParams()
  defaultSourceBody.append("default_source", source.id)
  const res = await stripeApi(`/customers/${stripeCustomerId}`, {
    body: defaultSourceBody,
    method: "POST",
  })

  ctx.body = res
}

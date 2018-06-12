import {format as formatDate} from "date-fns"
import * as fetch from "node-fetch"

const {RECHARGE_API_TOKEN} = process.env

const api = async (path, options = null) => {
  const res = await fetch(`https://api.rechargeapps.com${path}`, {
    headers: {
      "content-type": "application/json",
      "x-recharge-access-token": RECHARGE_API_TOKEN,
    },
    ...options,
  })
  return res.json()
}

export const updateAddress = async (address) => (await api(`/addresses/${address.id}`, {
  body: JSON.stringify(address),
  method: "PUT",
})).address

export const getAddress = async (addressId) => (await api(`/addresses/${addressId}`)).address

export const getCharge = async (chargeId) => (await api(`/charges/${chargeId}`)).charge

export const getUpcomingCharges = async (customerId) => (
  await api(`/charges?customer_id=${customerId}&date_min=${formatDate(new Date(), "YYYY-MM-DD")}`)
).charges

const toggleSkipCharge = (verb) => async (chargeId, subscription_id) => (
  api(`/charges/${chargeId}/${verb}`, {
    body: JSON.stringify({subscription_id}),
    method: "POST",
  })
)

export const skipCharge = toggleSkipCharge("skip")
export const unskipCharge = toggleSkipCharge("unskip")

export const getCustomer = async (shopifyCustomerId) => (
  (await api(`/customers?shopify_customer_id=${shopifyCustomerId}`)).customers[0]
)

export const updateCustomer = async (customerId, updates) => (await api(`/customers/${customerId}`, {
  body: JSON.stringify(updates),
  method: "PUT",
})).customer

export const getSubscriptions = async ({
  customerId,
  status = "",
}) => {
  let page = 1
  let subscriptions = []
  const limit = 250

  while (page) {
    const res = (
      await api(`/subscriptions?customer_id=${customerId}&status=${status}&page=${page}&limit=${limit}`)
    ).subscriptions
    subscriptions = subscriptions.concat(res)
    if (res.length === limit) {
      ++page
    } else {
      page = 0
    }
  }

  return subscriptions
}

export default api

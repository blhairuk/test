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
  const json = await res.json()
  const rootKey = Object.keys(json)[0]
  return json[rootKey]
}

export const getCustomer = async (customerHash) => (
  (await api(`/customers?hash=${customerHash}`))[0]
)

export const getSubscriptions = async ({
  customerId,
  status = "",
}) => {
  const page = await api(`/subscriptions?customer_id=${customerId}&status=${status}&limit=250`)
  return page
}

export default api

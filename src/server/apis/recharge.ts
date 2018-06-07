import * as fetch from "node-fetch"

const {RECHARGE_API_TOKEN} = process.env

function RechargeApiError(res) {
  this.res = res
}

const api = async (path, options = null) => {
  const res = await fetch(`https://api.rechargeapps.com${path}`, {
    headers: {
      "content-type": "application/json",
      "x-recharge-access-token": RECHARGE_API_TOKEN,
    },
    ...options,
  })
  if (res.status >= 200 && res.status < 400) {
    const json = await res.json()
    const rootKey = Object.keys(json)[0]
    return json[rootKey]
  } else {
    throw new RechargeApiError(res)
  }
}

export const createAddress = async (customerId, address) => api(`/customers/${customerId}/addresses`, {
  body: JSON.stringify(address),
  method: "POST",
})

export const deleteAddress = async (addressId) => api(`/addresses/${addressId}`, {method: "DELETE"})

export const getAddress = async (addressId) => api(`/addresses/${addressId}`)

export const getCustomerAddresses = async (customerId) => api(`/customers/${customerId}/addresses`)

export const getCustomer = async (shopifyCustomerId) => (
  (await api(`/customers?shopify_customer_id=${shopifyCustomerId}`))[0]
)

export const getSubscriptions = async ({
  customerId,
  status = "",
}) => {
  const page = await api(`/subscriptions?customer_id=${customerId}&status=${status}&limit=250`)
  return page
}

export default api

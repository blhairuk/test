import * as fetch from "node-fetch"

const {STRIPE_API_TOKEN} = process.env

const api = async (path, options = null) => {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      authorization: `Bearer ${STRIPE_API_TOKEN}`,
    },
    ...options,
  })
  return res.json()
}

export default api

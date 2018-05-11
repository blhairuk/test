import * as fetch from "node-fetch"

const {STRIPE_API_TOKEN} = process.env

const api = async (path) => {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${STRIPE_API_TOKEN}`,
    },
  })
  return res.json()
}

export default api

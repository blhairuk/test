import * as fetch from 'node-fetch'

const {RECHARGE_API_TOKEN} = process.env

const api = async (path, options = null) => {
  const res = await fetch(`https://api.rechargeapps.com${path}`, {
    headers: {
      'content-type': 'application/json',
      'x-recharge-access-token': RECHARGE_API_TOKEN,
    },
    ...options
  })
  const json = await res.json()
  const rootKey = Object.keys(json)[0]
  return json[rootKey]
}

export default api
import {Agent} from 'https'
import * as fetch from 'node-fetch'

export default async (shop, path, options) => {
  options.agent = new Agent({rejectUnauthorized: false})
  const res = await fetch(`https://${shop}/admin/${path}`, options)
  return res.json()
}
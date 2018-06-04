import * as Shopify from "shopify-api-node"

import {getToken} from "../db"

export default async (shopName) => {
  const accessToken = await getToken(shopName)
  return new Shopify({
    accessToken,
    shopName,
  })
}

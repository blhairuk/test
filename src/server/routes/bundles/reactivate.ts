import {
  getCustomer,
  getSubscriptions,
} from "../../apis/recharge"

import {isBundleIdInProperties} from "../../../shared/helpers"
import {activate} from "../../bundles"

export default () => async (ctx) => {
  const {
    params: {
      bundleId: bundleIdS,
      shopifyCustomerId,
    },
  } = ctx

  const bundleId = parseInt(bundleIdS, 10)

  const customer = await getCustomer(shopifyCustomerId)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: "CANCELLED"}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))

  await activate(subscriptions.map(({id}) => id))

  ctx.status = 204
}

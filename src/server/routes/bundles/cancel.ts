import {
  getCustomer,
  getSubscriptions,
} from "../../apis/recharge"

import {isBundleIdInProperties} from "../../../shared/helpers"
import {cancel} from "../../bundles"

export default () => async (ctx) => {
  const {
    params: {
      bundleId: bundleIdS,
      shopifyCustomerId,
    },
  } = ctx

  const bundleId = parseInt(bundleIdS, 10)

  const customer = await getCustomer(shopifyCustomerId)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: "ACTIVE"}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))

  await cancel(subscriptions.map(({id}) => id))

  ctx.status = 204
}

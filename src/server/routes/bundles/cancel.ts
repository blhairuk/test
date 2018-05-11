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
      customerHash,
    },
  } = ctx

  const bundleId = parseInt(bundleIdS)

  const customer = await getCustomer(customerHash)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: "ACTIVE"}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))

  await cancel(subscriptions.map(({id}) => id))

  ctx.status = 204
}

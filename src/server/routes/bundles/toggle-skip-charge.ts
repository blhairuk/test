import {
  getCharge,
  getCustomer,
  getSubscriptions,
  skipCharge,
  unskipCharge,
} from "../../apis/recharge"

import {
  isBundleIdInProperties,
} from "../../../shared/helpers"

export default () => async (ctx) => {
  const {
    params: {
      bundleId: bundleIdS,
      shopifyCustomerId,
    },
    query: {
      charge_id,
    },
  } = ctx

  const bundleId = parseInt(bundleIdS, 10)
  const customer = await getCustomer(shopifyCustomerId)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: "ACTIVE"}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))
  const charge = await getCharge(charge_id)

  const fn = charge.status === "SKIPPED" ? unskipCharge : skipCharge
  await Promise.all(subscriptions.map(async ({id: subscriptionId}) => {
    try {
      await fn(charge_id, subscriptionId)
    } catch (e) {
      // do nothing
    }
  }))

  ctx.status = 204
}

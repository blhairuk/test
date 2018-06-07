import {
  getCustomer,
  getSubscriptions,
} from "../../apis/recharge"

import {
  isBundleIdInProperties,
} from "../../../shared/helpers"

import {
  update as updateBundle,
} from "../../bundles"

export default () => async (ctx) => {
  const {
    bundleId,
    shopifyCustomerId,
  } = ctx.params

  const {addressId} = ctx.request.body

  const customer = await getCustomer(shopifyCustomerId)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: "ACTIVE"}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))

  await updateBundle(subscriptions.map(({id}) => id), {address_id: addressId})

  ctx.status = 204
}

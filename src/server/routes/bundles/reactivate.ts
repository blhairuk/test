import {
  getCustomer,
  getSubscriptions,
} from '../../apis/recharge'

import {isBundleIdInProperties} from '../../../shared/helpers'
import {activate} from '../../bundles'

export default () => async ctx => {
  const {
    params: {
      bundleId: bundleIdS,
      customerHash,
    }
  } = ctx

  const bundleId = parseInt(bundleIdS)

  const customer = await getCustomer(customerHash)
  const subscriptions = (await getSubscriptions({customerId: customer.id, status: 'CANCELLED'}))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))
  
  await activate(subscriptions.map(({id}) => id))

  ctx.status = 204
}
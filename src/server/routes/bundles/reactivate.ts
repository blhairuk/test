import {rechargeApi} from '../../fetch'
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

  const customer = (await rechargeApi(`/customers?hash=${customerHash}`))[0]
  const subscriptions = (await rechargeApi(`/subscriptions?customer_id=${customer.id}&status=CANCELLED&limit=250`))
    .filter(({properties}) => isBundleIdInProperties(bundleId, properties))
  
  await activate(subscriptions.map(({id}) => id))

  ctx.status = 204
}
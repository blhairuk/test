import {rechargeApi} from './fetch'
import {createBundleId} from '../helpers'

export const cancel = async subscriptionIds => (
  Promise.all(subscriptionIds.map(id => (
    rechargeApi(`/subscriptions/${id}/cancel`, {
      body: JSON.stringify({
        cancellation_reason: 'automated, editing bundle subscription',
      }),
      method: 'POST'
    })
  )))
)

export const create = subscriptionsData => {
  const bundleId = createBundleId()

  return Promise.all(subscriptionsData.map(data => (
    rechargeApi('/subscriptions', {
      body: JSON.stringify({
        ...data,
        properties: {
          ...data.properties,
          bundle_id: bundleId,
        }
      }),
      method: 'POST',
    })
  )))
}
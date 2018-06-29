import {createBundleId} from "../shared/helpers"
import rechargeApi from "./apis/recharge"

export const activate = async (subscriptionIds) => {
  for (const id of subscriptionIds) {
    await rechargeApi(`/subscriptions/${id}/activate`, {
      body: JSON.stringify({
        status: "ACTIVE",
      }),
      method: "POST",
    })
  }
}

export const cancel = async (subscriptionIds, {cancellation_reason = "unspecified"}) => {
  for (const id of subscriptionIds) {
    await rechargeApi(`/subscriptions/${id}/cancel`, {
      body: JSON.stringify({cancellation_reason}),
      method: "POST",
    })
  }
}

export const create = async (subscriptionsData) => {
  const bundleId = createBundleId()

  for (const data of subscriptionsData) {
    await rechargeApi("/subscriptions", {
      body: JSON.stringify({
        ...data,
        properties: {
          ...data.properties,
          bundle_id: bundleId,
        },
      }),
      method: "POST",
    })
  }
}

export const update = async (subscriptionIds, data) => {
  for (const id of subscriptionIds) {
    await rechargeApi(`/subscriptions/${id}`, {
      body: JSON.stringify(data),
      method: "PUT",
    })
  }
}

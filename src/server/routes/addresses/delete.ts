import {
  deleteAddress,
} from "../../apis/recharge"

export default () => async (ctx) => {
  const {addressId} = ctx.params
  try {
    await deleteAddress(addressId)
    ctx.status = 204
  } catch ({res}) {
    ctx.status = res.status
  }
}

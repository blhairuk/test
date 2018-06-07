import {
  updateAddress,
} from "../../apis/recharge"

export default () => async (ctx) => {
  ctx.body = await updateAddress(ctx.request.body)
}

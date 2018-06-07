import {
  createAddress,
  getCustomer,
} from "../../apis/recharge"

export default () => async (ctx) => {
  const {shopifyCustomerId} = ctx.params
  const customer = await getCustomer(shopifyCustomerId)
  ctx.body = await createAddress(customer.id, ctx.request.body)
}

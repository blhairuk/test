export default () => async ctx => {
  const {
    params: {
      bundleId,
      customerHash,
    }
  } = ctx

  const {
    add_on_ids,
    frequency,
    size,
    variant_ids,
  } = ctx.request.body

  // TODO:
  // read customer subscriptions, filter for bundle id
  // save address_id, next_charge_scheduled_at, order_interval_unit from first
  // cancel subscriptions
  // read products from shopify api for prices, titles, etc.
  // create subscription for main bundle product
  // reduce variants and add ons into idQuantities object
  // create subscriptions for idQuantities object 

  ctx.body = {
    bundleId,
    customerHash,
  }
}
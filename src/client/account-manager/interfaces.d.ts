declare interface RechargeAddress {
  address1: string,
  address2: string,
  city: string,
  id: number,
  zip: string,
}

declare interface RechargeOrder {
  id: number,
}

declare interface RechargeSubscription {
  address_id: number,
  id: number,
  price: number,
  product_title: string,
  properties: {
    name: string,
    value: string,
  }[],
  order_interval_frequency: string,
  order_interval_unit: string,
  next_charge_scheduled_at: string,
  quantity: number,
  status: 'ACTIVE' | 'CANCELLED',
}
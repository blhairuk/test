declare interface RechargeAddress {
  address1: string,
  address2: string,
  city: string,
  id: number,
  zip: string,
}

declare interface RechargeCharge {
  id: number,
  line_items: {
    title: string,
  }[],
  scheduled_at: string,
  status: 'QUEUED' | 'SKIPPED',
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

declare interface StripeCustomer {
  default_source: string,
  email: string,
  id: string,
  sources: {
    data: {
      address_city: string,
      address_country: string,
      address_line1: string,
      address_line2: string,
      address_state: string,
      address_zip: string,
      brand: string,
      exp_month: number,
      exp_year: number,
      id: string,
      last4: string,
      name: string,
    }[]
  }
}
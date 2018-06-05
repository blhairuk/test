declare interface RechargeAddress {
  address1: string,
  address2: string,
  city: string,
  company: string,
  first_name: string,
  id: number,
  last_name: string,
  province: string,
  zip: string,
}

declare interface RechargeCharge {
  id: number,
  line_items: Array<{
    title: string,
  }>,
  scheduled_at: string,
  status: "QUEUED" | "SKIPPED",
}

declare interface RechargeOrder {
  id: number,
}

declare interface RechargeSubscription {
  address_id: number,
  id: number,
  price: number,
  product_title: string,
  properties: Array<{
    name: string,
    value: string,
  }>,
  order_interval_frequency: string,
  order_interval_unit: string,
  next_charge_scheduled_at: string,
  quantity: number,
  shopify_product_id: number,
  shopify_variant_id: number,
  status: "ACTIVE" | "CANCELLED",
}

declare interface ShopifyCustomer {
  first_name: string,
  id: number,
  last_name: string,
}

declare interface StripeCustomer {
  default_source: string,
  email: string,
  id: string,
  sources: {
    data: Array<{
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
    }>,
  }
}

declare interface HHBundle {
  id: number,
  status: "ACTIVE" | "CANCELLED",
  subscriptions: RechargeSubscription[],
  subtotal: number,
}

declare interface RechargeAddress {
  address1: string,
  address2: string,
  city: string,
  company: string,
  country: string,
  first_name: string,
  id: number,
  last_name: string,
  phone: string,
  province: string,
  zip: string,
}

declare interface RechargeCharge {
  id: number,
  line_items: Array<{
    properties: Array<{
      name: string,
      value: string,
    }>,
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

declare interface ShopifyLineItem {
  id: number,
  price: string,
  quantity: number,
  sku: string,
  title: string,
}

declare interface ShopifyOrder {
  cancel_reason: string,
  cancelled_at: string,
  closed_at: string,
  created_at: string,
  discount_codes: Array<{
    amount: string,
    code: string,
    type: "percentage",
  }>,
  financial_status: string,
  fulfillment_status: string,
  id: number,
  line_items: ShopifyLineItem[],
  name: string,
  order_number: number,
  shipping_lines: Array<{
    id: number,
    price: string,
    title: string,
  }>,
  subtotal_price: string,
  total_price: string,
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

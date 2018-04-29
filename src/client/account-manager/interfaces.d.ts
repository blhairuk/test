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
}
import {getMetafieldValue} from "../../shared/helpers"

export const getAvailableFrequencies = (bundleProductMetafields: ShopifyProductMetafield) => (
  getMetafieldValue(
    bundleProductMetafields,
    "subscriptions",
    "shipping_interval_frequency",
  )
  .split(",")
  .map((f) => parseInt(f, 10))
)

export const getAvailableSizes = (bundleProduct: ShopifyProduct) => (
  bundleProduct.variants.map(({option1}) => parseInt(option1, 10))
)

export const getBundlePrice = (bundleProduct: ShopifyProduct, selectedSize: number) => (
  parseFloat(bundleProduct.variants.find(({option1}) => parseInt(option1, 10) === selectedSize).price)
)

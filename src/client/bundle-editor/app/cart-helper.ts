import {BUNDLE_TYPE} from "../../../shared/constants"
import updateStateKeys from "../../helpers/update-state-keys"

import App from "../App"

import {
  createBundleId,
  createIdQuantities,
  getMetafieldValue,
} from "../../../shared/helpers"

import {
  addToCart,
  fetchCart,
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from "../../helpers/cart"

export interface Helper {
  addBundle: (bundleId: number, extraData: any) => any,
  extractState: (bundleId: number) => any,
  submitBundleUpdates: () => Promise<any>,
}

export default (app: App): Helper => ({
  addBundle: (bundleId, extraData) => {
    const {bundleProductMetafields} = app.props

    const shipping_interval_unit_type = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_unit_type",
    )
    const subscription_id = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "subscription_id",
    )

    return addToCart({
      ...extraData,
      properties: {
        bundle_id: bundleId,
        shipping_interval_frequency: app.state.selectedFrequency,
        shipping_interval_unit_type,
        subscription_id,
        ...extraData.properties,
      },
    })
  },

  extractState: async (bundleId) => {
    const {
      bundleAddOns,
      bundleProducts,
    } = app.props

    const cart = await fetchCart()

    let bundleName = ""
    let enteredEmail = ""
    let enteredName = ""
    const selectedAddOnIds = []
    let selectedFrequency = null
    const selectedProductIds = []
    let selectedSize = null
    const selectedVariantIds = []

    for (const item of cart.items) {
      const {
        properties: {
          bundle_customer_name,
          bundle_email,
          bundle_id: itemBundleId,
          bundle_name,
          shipping_interval_frequency: frequency,
        },
        product_id,
        product_type: productType,
        quantity,
        variant_id: variantId,
        variant_options: [size],
      } = item

      if (itemBundleId === bundleId) {
        if (productType === BUNDLE_TYPE) {
          enteredEmail = bundle_email
          bundleName = bundle_name
          enteredName = bundle_customer_name
          selectedSize = parseInt(size, 10)
          selectedFrequency = frequency
        } else {
          const selectedArray = (() => {
            if (bundleAddOns.some((p) => p.id === product_id)) { return selectedAddOnIds }
            if (bundleProducts.some((p) => p.id === product_id)) { return selectedVariantIds }
          })()
          if (selectedArray) {
            for (let i = 0; i < quantity; ++i) {
              selectedArray.push(variantId)
              selectedProductIds.push(product_id)
            }
          }
        }
      }
    }

    return {
      bundleName,
      editingBundleId: bundleId,
      enteredEmail,
      enteredName,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
    }
  },

  async submitBundleUpdates() {
    const {bundleProduct} = app.props

    const {
      bundleName,
      editingBundleId,
      enteredEmail,
      enteredName,
      selectedAddOnIds,
      selectedSize,
      selectedVariantIds,
    } = app.state

    if (editingBundleId) {
      await removeBundleIdFromCart(editingBundleId)
    }

    const sizeVariantId = bundleProduct.variants
      .find((v) => parseInt(v.option1, 10) === selectedSize)
      .id
    const bundleId = editingBundleId || createBundleId()
    const idQuantities = createIdQuantities(selectedVariantIds.concat(selectedAddOnIds))

    await this.addBundle(bundleId, {
      id: sizeVariantId,
      properties: {
        bundle_customer_name: enteredName,
        bundle_email: enteredEmail,
        bundle_name: bundleName,
      },
      quantity: 1,
    })

    for (const id in idQuantities) {
      if (idQuantities.hasOwnProperty(id)) {
        await this.addBundle(bundleId, {
          id,
          quantity: idQuantities[id],
        })
      }
    }

    updateCartDrawerUI()

    app.setState(updateStateKeys({editingBundleId: bundleId}))
  },
})

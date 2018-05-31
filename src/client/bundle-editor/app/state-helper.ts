import updateStateKeys from "../../helpers/update-state-keys"
import App from "../app"

import {createBundleName} from "../../../shared/helpers"
import {getBundlePrice} from "../../helpers/bundle"

export interface Helper {
  addVariant: (variant: ShopifyVariant, product: ShopifyProduct) => () => any,
  enterEmail: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  removeVariant: (variant: ShopifyVariant, product: ShopifyProduct, quantity?: number) => () => any,
  setSelectedFrequency: (frequency: number) => () => any,
  setSelectedSize: (size: number) => () => any,
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
}

export default (app: App): Helper => ({
  addVariant: (variant: ShopifyVariant, product: ShopifyProduct) => () => {
    const {
      selectedAddOnIds,
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
    } = app.state

    if (!selectedSize) {
      return alert("You must selected a size first.")
    }

    if (product.product_type !== "Booster" && selectedVariantIds.length >= selectedSize) {
      return app.setState(updateStateKeys({isBundleFullModalOpen: true}))
    }

    const selectedArray = product.product_type === "Booster" ? selectedAddOnIds : selectedVariantIds
    selectedArray.push(variant.id)

    selectedProductIds.push(variant.product_id)

    app.setState(updateStateKeys({selectedAddOnIds, selectedProductIds, selectedVariantIds}))
  },

  enterEmail: ({target: {value: enteredEmail}}) => {
    app.setState(updateStateKeys({enteredEmail}))
  },

  enterName: ({target: {value: enteredName}}) => {
    app.setState(updateStateKeys({
      bundleName: enteredName ? createBundleName(enteredName) : "",
      enteredName,
    }))
  },

  removeVariant: (variant: ShopifyVariant, product: ShopifyProduct, quantity = 1) => () => {
    const {
      selectedAddOnIds,
      selectedProductIds,
      selectedVariantIds,
    } = app.state

    const selectedArray = product.product_type === "Booster" ? selectedAddOnIds : selectedVariantIds

    for (let i = 0; i < quantity; ++i) {
      selectedProductIds.splice(selectedProductIds.indexOf(product.id), 1)
      selectedArray.splice(selectedArray.indexOf(variant.id), 1)
    }

    app.setState(updateStateKeys({selectedAddOnIds, selectedProductIds, selectedVariantIds}))
  },

  setSelectedFrequency: (selectedFrequency) => () => {
    app.setState(updateStateKeys({selectedFrequency}))
  },

  setSelectedSize: (selectedSize) => () => {
    const {bundleProduct} = app.props
    const {selectedVariantIds} = app.state

    selectedVariantIds.splice(selectedSize)

    app.setState(updateStateKeys({
      selectedBundlePrice: getBundlePrice(bundleProduct, selectedSize),
      selectedSize,
      selectedVariantIds,
    }))
  },

  updateBundleName({target: {value: bundleName}}) {
    app.setState(updateStateKeys({bundleName}))
  },
})

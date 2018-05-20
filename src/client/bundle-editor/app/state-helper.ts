import updateStateKeys from "../../helpers/update-state-keys"
import App from "../app"

import {createBundleName} from "../../../shared/helpers"

export interface Helper {
  addAddOnId: (productId: number, variantId: any) => () => any,
  addVariantId: (productId: number, variantId: any) => () => any,
  enterEmail: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  removeAddOnId: (productId: number, variantId: any) => () => any,
  removeVariantId: (productId: number, variantId: any) => () => any,
  setSelectedFrequency: (frequency: number) => () => any,
  setSelectedSize: (size: number) => () => any,
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
}

export default (app: App): Helper => ({
  addAddOnId: (productId, variantId) => () => {
    const {selectedSize} = app.state

    let {
      selectedAddOnIds,
      selectedProductIds,
    } = app.state

    if (!selectedSize) {
      return alert("You must select a size first.")
    }

    selectedAddOnIds = selectedAddOnIds.concat([...Array(selectedSize)].map(() => variantId))
    selectedProductIds = selectedProductIds.concat([...Array(selectedSize)].map(() => productId))

    app.setState(updateStateKeys({selectedAddOnIds, selectedProductIds}))
  },

  addVariantId: (productId, variantId) => () => {
    const {
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
    } = app.state

    if (!selectedSize) {
      return alert("You must selected a size first.")
    }

    if (selectedVariantIds.length >= selectedSize) {
      return app.setState(updateStateKeys({isBundleFullModalOpen: true}))
    }

    selectedProductIds.push(productId)
    selectedVariantIds.push(variantId)

    app.setState(updateStateKeys({selectedProductIds, selectedVariantIds}))
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

  removeAddOnId: (productId, variantId) => () => {
    const {
      selectedAddOnIds,
      selectedProductIds,
      selectedSize,
    } = app.state

    for (let i = 0; i < (selectedSize || 1); ++i) {
      selectedAddOnIds.splice(selectedAddOnIds.indexOf(variantId), 1)
      selectedProductIds.splice(selectedProductIds.indexOf(productId), 1)
    }

    app.setState(updateStateKeys({selectedAddOnIds, selectedProductIds}))
  },

  removeVariantId: (productId, variantId, quantity = 1) => () => {
    const {
      selectedProductIds,
      selectedVariantIds,
    } = app.state

    for (let i = 0; i < quantity; ++i) {
      selectedProductIds.splice(selectedProductIds.indexOf(productId), 1)
      selectedVariantIds.splice(selectedVariantIds.indexOf(variantId), 1)
    }

    app.setState(updateStateKeys({selectedProductIds, selectedVariantIds}))
  },

  setSelectedFrequency: (selectedFrequency) => () => {
    app.setState(updateStateKeys({selectedFrequency}))
  },

  setSelectedSize: (selectedSize) => () => {
    const {selectedVariantIds} = app.state

    selectedVariantIds.splice(selectedSize)

    app.setState(updateStateKeys({
      selectedSize,
      selectedVariantIds,
    }))
  },

  updateBundleName({target: {value: bundleName}}) {
    app.setState(updateStateKeys({bundleName}))
  },
})

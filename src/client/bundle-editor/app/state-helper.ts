import updateStateKeys from "../../helpers/update-state-keys"

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

export default (App): Helper => ({
  addAddOnId: (productId, variantId) => () => {
    const {selectedSize} = App.state

    let {
      selectedAddOnIds,
      selectedProductIds,
    } = App.state

    if (!selectedSize) {
      return alert("You must select a size first.")
    }

    selectedAddOnIds = selectedAddOnIds.concat([...Array(selectedSize)].map(() => variantId))
    selectedProductIds = selectedProductIds.concat([...Array(selectedSize)].map(() => productId))

    App.setState(updateStateKeys({selectedAddOnIds, selectedProductIds}))
  },

  addVariantId: (productId, variantId) => () => {
    const {
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
    } = App.state

    if (!selectedSize) {
      return alert("You must selected a size first.")
    }

    if (selectedVariantIds.length >= selectedSize) {
      return App.setState(updateStateKeys({isBundleFullModalOpen: true}))
    }

    selectedProductIds.push(productId)
    selectedVariantIds.push(variantId)

    App.setState(updateStateKeys({selectedProductIds, selectedVariantIds}))
  },

  enterEmail: ({target: {value: enteredEmail}}) => {
    App.setState(updateStateKeys({enteredEmail}))
  },

  enterName: ({target: {value: enteredName}}) => {
    App.setState(updateStateKeys({
      bundleName: enteredName ? App.createBundleName(enteredName) : "",
      enteredName,
    }))
  },

  removeAddOnId: (productId, variantId) => () => {
    const {
      selectedAddOnIds,
      selectedProductIds,
      selectedSize,
    } = App.state

    for (let i = 0; i < (selectedSize || 1); ++i) {
      selectedAddOnIds.splice(selectedAddOnIds.indexOf(variantId), 1)
      selectedProductIds.splice(selectedProductIds.indexOf(productId), 1)
    }

    App.setState(updateStateKeys({selectedAddOnIds, selectedProductIds}))
  },

  removeVariantId: (productId, variantId) => () => {
    const {
      selectedProductIds,
      selectedVariantIds,
    } = App.state

    selectedProductIds.splice(selectedProductIds.indexOf(productId), 1)
    selectedVariantIds.splice(selectedVariantIds.indexOf(variantId), 1)

    App.setState(updateStateKeys({selectedProductIds, selectedVariantIds}))
  },

  setSelectedFrequency: (selectedFrequency) => () => {
    App.setState(updateStateKeys({selectedFrequency}))
  },

  setSelectedSize: (selectedSize) => () => {
    const {selectedVariantIds} = App.state

    selectedVariantIds.splice(selectedSize)

    App.setState(updateStateKeys({
      selectedSize,
      selectedVariantIds,
    }))
  },

  updateBundleName({target: {value: bundleName}}) {
    App.setState(updateStateKeys({bundleName}))
  },
})

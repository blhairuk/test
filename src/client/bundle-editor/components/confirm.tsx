import * as React from "react"

import {createIdQuantities} from "../../../shared/helpers"

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleProducts: ShopifyProduct[],
  enteredName: string,
  isActiveStep: boolean,
  isEditingBundle: boolean,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedProductIds: number[],
  selectedSize: number,
  selectedVariantIds: number[],
  stepPrev: (e?: React.FormEvent<HTMLElement>) => any,
  submit: () => any,
}

export default class Confirm extends React.Component<Props> {
  public render() {
    const {
      bundleAddOns,
      bundleProducts,
      // enteredName,
      isSubmitting,
      // selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      // selectedVariantIds,
      stepPrev,
      submit,
    } = this.props

    // let errorMessage
    // if (!enteredName) { errorMessage = "Enter a name" }
    // else if (!selectedSize) { errorMessage = "Enter a size" }
    // else if (!selectedFrequency) { errorMessage = "Enter a frequency" }
    // else if (selectedVariantIds.length < selectedSize) { errorMessage = "You need to add products" }
    // else if (selectedVariantIds.length > selectedSize) { errorMessage = "You need to remove products" }
    // if (errorMessage) { return <div>{errorMessage}</div> }

    const idQuantities = createIdQuantities(selectedProductIds)

    const allProducts = bundleProducts.concat(bundleAddOns)

    const renderProduct = ([productIdS, quantity]) => {
      const productId = parseInt(productIdS, 10)
      const product = allProducts.find(({id}) => id === productId)

      return (
        <div key={productId}>
          {quantity}x {product.title}
        </div>
      )
    }

    return (
      <div>
        <div>
          <button
            onClick={stepPrev}
            type="button"
          >
            Prev
          </button>
        </div>

        <div>
          <div>Selected frequency: {selectedFrequency}</div>
          <div>Selected size: {selectedSize}</div>
        </div>

        <div>
          <h3>Items</h3>
          {Object.entries(idQuantities).map(renderProduct)}
        </div>

        <button
          className="btn"
          disabled={isSubmitting}
          onClick={submit}
          type="button"
        >
          {this.buttonText()}
        </button>
      </div>
    )
  }

  private buttonText = () => {
    const {
      isEditingBundle,
      isSubmitting,
    } = this.props

    if (isEditingBundle) { return isSubmitting ? "Updating..." : "Update bundle" }
    return isSubmitting ? "Adding..." : "Add to cart"
  }
}

import * as React from "react"

import {
  createIdQuantities,
  findProductByVariantId,
} from "../../../shared/helpers"

interface Props {
  enteredName: string,
  isEditingBundle: boolean,
  isSubmitting: boolean,
  products: ShopifyProduct[],
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedSize: number,
  selectedVariantIds: number[],
  stepPrev: (e?: React.FormEvent<HTMLElement>) => any,
  submit: (any) => any,
}

export default class Confirm extends React.Component<Props> {
  public render() {
    const {
      enteredName,
      isSubmitting,
      products,
      selectedAddOnIds,
      selectedFrequency,
      selectedSize,
      selectedVariantIds,
      stepPrev,
      submit,
    } = this.props

    let errorMessage
    if (!enteredName) { errorMessage = "Enter a name" }
    else if (!selectedSize) { errorMessage = "Enter a size" }
    else if (!selectedFrequency) { errorMessage = "Enter a frequency" }
    else if (selectedVariantIds.length < selectedSize) { errorMessage = "You need to add products" }
    else if (selectedVariantIds.length > selectedSize) { errorMessage = "You need to remove products" }
    if (errorMessage) { return <div>{errorMessage}</div> }

    const idQuantities = createIdQuantities(selectedVariantIds.concat(selectedAddOnIds))
    const productQuantities = Object.entries(idQuantities).map(([id, quantity]) => ({
      product: findProductByVariantId(products, parseInt(id)),
      quantity,
    }))

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
          {productQuantities.map(({product: {id, title}, quantity}) => (
            <div key={id}>
              {quantity}x {title}
            </div>
          ))}
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

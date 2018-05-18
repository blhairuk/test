import * as React from "react"

import {createIdQuantities} from "../../../shared/helpers"
import StepHeader from "./step-header"

interface Props {
  allProducts: ShopifyProduct[],
  isActiveStep: boolean,
  isEditingBundle: boolean,
  isSubmitting: boolean,
  selectedFrequency: number,
  selectedProductIds: number[],
  selectedSize: number,
  stepPrev: () => any,
  submit: () => any,
}

export default class Confirm extends React.Component<Props> {
  public render() {
    const {
      allProducts,
      isEditingBundle,
      isSubmitting,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      stepPrev,
      submit,
    } = this.props

    const idQuantities = createIdQuantities(selectedProductIds)

    return (
      <div>
        <StepHeader
          stepPrev={stepPrev}
          title="REVIEW YOUR BOX"
        />

        <div>
          <div>Selected frequency: {selectedFrequency}</div>
          <div>Selected size: {selectedSize}</div>
        </div>

        <div>
          <h3>Items</h3>
          {Object.entries(idQuantities).map(([productIdS, quantity]) => {
            const productId = parseInt(productIdS, 10)
            const product = allProducts.find(({id}) => id === productId)

            return (
              <div key={productId}>
                {quantity}x {product.title}
              </div>
            )
          })}
        </div>

        <button
          className="btn"
          disabled={isSubmitting}
          onClick={submit}
          type="button"
        >
          {(() => {
            if (isEditingBundle) { return isSubmitting ? "Updating..." : "Update bundle" }
            return isSubmitting ? "Adding..." : "Add to cart"
          })()}
        </button>
      </div>
    )
  }
}

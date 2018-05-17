import * as React from "react"

import {createIdQuantities} from "../../../shared/helpers"
import {Context as AppContext} from "../app"

interface Props {
  isActiveStep: boolean,
}

export default class Confirm extends React.Component<Props> {
  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    allProducts,
    isEditingBundle,
    isSubmitting,
    selectedFrequency,
    selectedProductIds,
    selectedSize,
    stepPrev,
    submit,
  }) => {
    const idQuantities = createIdQuantities(selectedProductIds)

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

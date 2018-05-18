import * as React from "react"

import {createIdQuantities} from "../../../shared/helpers"
import StepHeader from "./step-header"
import Button from "./styled/button"

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

        <div className="grid grid--uniform">
          <div className="grid__item medium-up--two-thirds">
            <h3>Items</h3>

            <div className="grid grid--uniform">
              {Object.entries(idQuantities).map(([productIdS, quantity]) => {
                const productId = parseInt(productIdS, 10)
                const product = allProducts.find(({id}) => id === productId)
                const {
                  image: {src},
                  title,
                } = product

                return (
                  <div
                    className="grid__item medium-up--one-third"
                    key={productId}
                  >
                    <img src={src} />
                    <div>{title}</div>
                    <div>{quantity}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid__item medium-up--one-third">
            <div>
              <div>Selected frequency: {selectedFrequency}</div>
              <div>Selected size: {selectedSize}</div>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={submit}
              type="button"
            >
              {(() => {
                if (isEditingBundle) { return isSubmitting ? "Updating..." : "Update bundle" }
                return isSubmitting ? "Adding..." : "Add to cart"
              })()}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

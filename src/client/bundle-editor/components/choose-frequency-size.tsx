import * as React from "react"

import {
  frequencySingularTitle,
  frequencyTitle,
  getMetafieldValue,
} from "../../../shared/helpers"

import SizeToggler from "./size-toggler"
import StepButtons from "./step-buttons"

interface Props {
  bundleProduct: ShopifyProduct,
  bundleProductMetafields: ShopifyProductMetafield[],
  isActiveStep: boolean,
  isEditingSubscription: boolean,
  selectedFrequency: number,
  setSelectedFrequency: (number) => () => any,
  selectedSize: number,
  setSelectedSize: (number) => () => any,
  stepNext: () => any,
  stepPrev: () => any,
}

export default class ChooseFrequencySize extends React.Component<Props> {
  public render() {
    const {
      bundleProduct,
      bundleProductMetafields,
      isEditingSubscription,
      selectedFrequency,
      selectedSize,
      setSelectedFrequency,
      setSelectedSize,
      stepNext,
      stepPrev,
    } = this.props

    const shippingFrequencies = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_frequency",
    ).split(",").map((f) => parseInt(f, 10))

    const shippingUnitType = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_unit_type",
    )

    const selectedVariant = bundleProduct.variants.find(({option1}) => parseInt(option1, 10) === selectedSize)
    const price = selectedVariant ? parseFloat(selectedVariant.price) : null

    const title = isEditingSubscription ? "Select your plan." : "Thanks! Select your plan."

    return (
      <div className="text-center larger-text">
        <form onSubmit={stepNext}>
          <h1>{title}</h1>

          <p><small><em>Edit, pause, or cancel anytime!</em></small></p>

          <div className="grid grid--uniform grid--no-gutters">
            {shippingFrequencies.map((frequency) => (
              <div
                className="grid__item one-half text-center"
                key={frequency}
                onClick={setSelectedFrequency(frequency)}
                style={{backgroundColor: "#000"}}
              >
                <div>{frequencyTitle(shippingUnitType, frequency)}</div>

                {selectedFrequency === frequency && (
                  <div>
                    <SizeToggler
                      bundleProduct={bundleProduct}
                      selectedSize={selectedSize}
                      setSelectedSize={setSelectedSize}
                    />

                    {selectedSize && (
                      <>
                        <div>{price / selectedSize} per cup</div>
                        <div>{price} per {frequencySingularTitle(shippingUnitType, frequency)}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <StepButtons
            hidePrev={isEditingSubscription}
            isNextDisabled={!selectedSize || !selectedFrequency}
            stepPrev={stepPrev}
          />
        </form>
      </div>
    )
  }
}

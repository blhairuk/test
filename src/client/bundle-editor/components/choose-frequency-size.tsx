import * as React from "react"

import {
  frequencySingularTitle,
  frequencyTitle,
  getMetafieldValue,
} from "../../../shared/helpers"

import SizeToggler from "./size-toggler"
import StepButtons from "./step-buttons"
import FrequencySizeContainer from "./styled/frequency-size-container"

interface Props {
  availableFrequencies: number[],
  availableSizes: number[],
  bundleProductMetafields: ShopifyProductMetafield[],
  isActiveStep: boolean,
  isEditingSubscription: boolean,
  selectedBundlePrice: number,
  selectedFrequency: number,
  setSelectedFrequency: (number) => () => any,
  selectedSize: number,
  setSelectedSize: (number) => () => any,
  stepNext: () => any,
  stepPrev: () => any,
}

export default class ChooseFrequencySize extends React.Component<Props> {
  public componentDidUpdate(prevProps) {
    if (!prevProps.isActiveStep && this.props.isActiveStep) {
      const input = document.activeElement
      if (input instanceof HTMLElement) { input.blur() }
    }
  }

  public render() {
    const {
      availableFrequencies,
      availableSizes,
      bundleProductMetafields,
      isEditingSubscription,
      selectedBundlePrice,
      selectedFrequency,
      selectedSize,
      setSelectedFrequency,
      setSelectedSize,
      stepNext,
      stepPrev,
    } = this.props

    const shippingUnitType = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_unit_type",
    )

    const title = isEditingSubscription ? "Select your plan." : "Thanks! Select your plan."

    return (
      <div className="text-center larger-text">
        <form onSubmit={stepNext}>
          <h1>{title}</h1>

          <p><small><em>Edit, pause, or cancel anytime!</em></small></p>

          <div
            className="grid grid--uniform grid--no-gutters"
            style={{marginBottom: "20px"}}
          >
            {availableFrequencies.map((frequency) => (
              <div
                className="grid__item one-half text-center"
                key={frequency}
                onClick={setSelectedFrequency(frequency)}
              >
                <FrequencySizeContainer isSelected={selectedFrequency === frequency}>
                  <div>{frequencyTitle(shippingUnitType, frequency)}</div>

                  {selectedFrequency === frequency && (
                    <div>
                      <SizeToggler
                        availableSizes={availableSizes}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                      />

                      {selectedSize && (
                        <>
                          <div>{selectedBundlePrice / selectedSize} per cup</div>
                          <div>{selectedBundlePrice} per {frequencySingularTitle(shippingUnitType, frequency)}</div>
                        </>
                      )}
                    </div>
                  )}
                </FrequencySizeContainer>
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

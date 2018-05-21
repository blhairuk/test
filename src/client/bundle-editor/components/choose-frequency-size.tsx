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

    return (
      <div
        className="text-center larger-text one-whole"
        style={{maxWidth: "600px"}}
      >
        <form onSubmit={stepNext}>
          <div
            style={{
              fontSize: "200%",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            {isEditingSubscription ? "Select a plan." : "Thanks! Select a plan."}
          </div>

          <p
            style={{
              fontSize: "90%",
              textTransform: "uppercase",
            }}
          >
            <small>
              <em>Edit, pause, or cancel anytime!</em>
            </small>
          </p>

          <div
            className="grid grid--uniform"
            style={{marginBottom: "20px"}}
          >
            {availableFrequencies.map((frequency) => (
              <div
                className="grid__item medium-up--one-half text-center"
                key={frequency}
                onClick={setSelectedFrequency(frequency)}
              >
                <FrequencySizeContainer isSelected={selectedFrequency === frequency}>
                  <div className="fsc-title">
                    {frequencyTitle(shippingUnitType, frequency)}
                  </div>

                  <div className="fsc-subtitle">
                    Ships every {frequency * 7} days.
                  </div>

                  {selectedFrequency === frequency && (
                    <>
                      <div className="fsc-cpw">Cups per week</div>

                      <SizeToggler
                        availableSizes={availableSizes}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                      />

                      {selectedSize && (
                        <>
                          <div>${selectedBundlePrice / selectedSize}/CUP</div>
                          <div>
                            ${selectedBundlePrice}/{frequencySingularTitle(shippingUnitType, frequency).toUpperCase()}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </FrequencySizeContainer>
              </div>
            ))}
          </div>

          <StepButtons
            hidePrev={isEditingSubscription}
            isNextDisabled={!selectedSize || !selectedFrequency}
            nextText="FILL YOUR BOX!"
            stepPrev={stepPrev}
          />
        </form>
      </div>
    )
  }
}

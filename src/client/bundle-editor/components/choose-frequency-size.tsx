import {formatMoney} from "accounting"
import {Box, Flex} from "grid-styled"
import * as React from "react"

import {
  frequencySingularTitle,
  frequencyTitle,
} from "../../../shared/helpers"

import SizeToggler from "./size-toggler"
import StepButtons from "./step-buttons"
import FrequencySizeContainer from "./styled/frequency-size-container"

interface Props {
  availableFrequencies: number[],
  availableSizes: number[],
  frequencyUnitType: string,
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
  public componentDidMount() {
    this.initBodymovinAnimation()
  }

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
      frequencyUnitType,
      isEditingSubscription,
      selectedBundlePrice,
      selectedFrequency,
      selectedSize,
      setSelectedFrequency,
      setSelectedSize,
      stepNext,
      stepPrev,
    } = this.props

    return (
      <div
        className="text-center larger-text one-whole"
        style={{maxWidth: "600px"}}
      >
        <BlobDiv id="blob-intro" />
        <form
          className="position-relative"
          onSubmit={stepNext}
        >
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

          <Flex
            flexWrap="wrap"
            mb={2}
            mx={-2}
          >
            {availableFrequencies.map((frequency) => (
              <Box
                className="text-center"
                key={frequency}
                onClick={setSelectedFrequency(frequency)}
                mb={3}
                px={2}
                width={[1, 1 / 2]}
              >
                <FrequencySizeContainer isSelected={selectedFrequency === frequency}>
                  <div className="fsc-title">
                    {frequencyTitle(frequencyUnitType, frequency)}
                  </div>

                  <div className="fsc-subtitle">
                    Ships every {frequency * 7} days.
                  </div>

                  {selectedFrequency === frequency && (
                    <>
                      <div className="fsc-cpw">
                        <span>Cups per </span>
                        {frequencySingularTitle(frequencyUnitType, frequency).toLowerCase()}
                      </div>

                      <SizeToggler
                        availableSizes={availableSizes}
                        sectionBelow={
                          <small>
                            <div>{formatMoney(selectedBundlePrice / selectedSize)}/CUP</div>
                            <div>
                              {formatMoney(selectedBundlePrice)}/
                              {frequencySingularTitle(frequencyUnitType, frequency).toUpperCase()}
                            </div>
                          </small>
                        }
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                      />
                    </>
                  )}
                </FrequencySizeContainer>
              </Box>
            ))}
          </Flex>

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

  private initBodymovinAnimation = () => {
    if (window.bodymovin) {
      window.bodymovin.loadAnimation({
        autoplay: true,
        container: document.getElementById("blob-intro"),
        loop: true,
        name: "Build your box",
        path: window.HH.AssetURLs.Blob,
        renderer: "svg",
      })
    }
  }
}

const BlobDiv = Box.extend`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
`

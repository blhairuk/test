import * as React from "react"
import styled from "styled-components"

import {
  frequencyTitle,
  getMetafieldValue,
} from "../../../shared/helpers"
import {Context as AppContext} from "../app"
import Button from "./styled/button"

interface Props {
  isActiveStep: boolean,
}

interface GridItemProps {
  selected: boolean
}

const GridItem = styled.div`
  border: ${({selected}: GridItemProps) => selected ? "1px solid red" : "1px solid transparent"};
  cursor: pointer;
`

export default class ChooseFrequencySize extends React.Component<Props> {
  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    bundleProduct: {variants},
    bundleProductMetafields,
    selectedFrequency,
    selectedSize,
    setSelectedFrequency,
    setSelectedSize,
    stepNext,
    stepPrev,
  }) => {
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

    return (
      <div>
        <h2>Thanks! Select your plan.</h2>
        <div>Edit, pause, or cancel anytime.</div>
        <div className="grid grid--uniform">
          {shippingFrequencies.map((frequency) => (
            <GridItem
              className="grid__item medium-up--one-half text-center"
              key={frequency}
              onClick={setSelectedFrequency(frequency)}
              selected={selectedFrequency === frequency}
            >
              <div>{frequencyTitle(shippingUnitType, frequency)}</div>

              {selectedFrequency === frequency && (
                <div className="grid grid--uniform">
                  {variants.map(({id, option1, price}) => {
                    const size = parseInt(option1, 10)
                    return (
                      <GridItem
                        className="grid__item one-half text-center"
                        key={id}
                        onClick={setSelectedSize(size)}
                        selected={selectedSize === size}
                      >
                        <div>{option1} for {price} ({price / option1} per cup)</div>
                      </GridItem>
                    )
                  })}
                </div>
              )}
            </GridItem>
          ))}
        </div>

        <div>
          <Button
            onClick={stepPrev}
            type="button"
          >
            Prev
          </Button>

          <Button
            disabled={!selectedSize || !selectedFrequency}
            onClick={stepNext}
            type="submit"
          >
            Fill your box!
          </Button>
        </div>
      </div>
    )
  }
}

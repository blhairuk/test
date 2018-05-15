import * as React from "react"
import styled from "styled-components"

import Button from "./styled/button"

interface Props {
  frequencies: string[],
  variants: ShopifyVariant[],
  selectedSize: number,
  setSelectedSize: (e: React.MouseEvent<HTMLElement>) => any,
  selectedFrequency: number,
  setSelectedFrequency: (e: React.MouseEvent<HTMLElement>) => any,
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
  unitType: string,
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
    const {
      frequencies,
      selectedFrequency,
      selectedSize,
      stepNext,
      stepPrev,
      variants,
    } = this.props

    const renderSize = ({id, option1, price}) => {
      const size = parseInt(option1, 10)

      return (
        <GridItem
          className="grid__item one-half text-center"
          key={id}
          onClick={this.setSelectedSize(size)}
          selected={selectedSize === size}
        >
          <div>{option1} for {price} ({price / option1} per cup)</div>
        </GridItem>
      )
    }

    const renderSizes = () => (
      <div className="grid grid--uniform">
        {variants.map(renderSize)}
      </div>
    )

    const renderFrequency = (frequencyS) => {
      const frequency = parseInt(frequencyS, 10)

      return (
        <GridItem
          className="grid__item medium-up--one-half text-center"
          key={frequency}
          onClick={this.setSelectedFrequency(frequency)}
          selected={selectedFrequency === frequency}
        >
          <div>{this.frequencyTitle(frequency)}</div>

          {selectedFrequency === frequency && renderSizes()}
        </GridItem>
      )
    }

    return (
      <div>
        <h2>Thanks! Select your plan.</h2>
        <div>Edit, pause, or cancel anytime.</div>
        <div className="grid grid--uniform">
          {frequencies.map(renderFrequency)}
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

  private setSelectedFrequency = (frequency) => () => {
    this.props.setSelectedFrequency(frequency)
  }

  private setSelectedSize = (size) => () => {
    this.props.setSelectedSize(size)
  }

  private frequencyTitle = (frequency) => {
    const {unitType} = this.props

    if (frequency === 1 && unitType === "Weeks") { return "Weekly" }
    if (frequency === 4 && unitType === "Weeks") { return "Monthly" }
  }
}

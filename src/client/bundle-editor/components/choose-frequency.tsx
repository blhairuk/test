import * as React from "react"
import styled from "styled-components"

interface Props {
  frequencies: string[],
  selectedFrequency: number,
  setSelectedFrequency: (number) => any,
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
  unitType: string,
}

interface GridItemProps {
  selected: boolean,
}

const GridItem = styled.div`
  border: ${({selected}: GridItemProps) => selected ? "1px solid red" : "1px solid transparent"};
  cursor: pointer;
`

export default class ChooseFrequency extends React.Component<Props> {
  public render() {
    const {
      frequencies,
      selectedFrequency,
      stepPrev,
      unitType,
    } = this.props

    return (
      <div>
        <h2 className="h3">Choose your frequency:</h2>
        <div className="grid grid--uniform">
          {frequencies.map((frequency) => (
            <GridItem
              className="grid__item medium-up--one-third text-center"
              key={frequency}
              onClick={this.setSelectedFrequency.bind(this, parseInt(frequency))}
              selected={selectedFrequency === parseInt(frequency)}
            >
              {frequency} {unitType}
            </GridItem>
          ))}
        </div>
        <div>
          <button
            onClick={stepPrev}
            type="button"
          >
            Prev
          </button>
        </div>
      </div>
    )
  }

  private setSelectedFrequency = (frequency) => {
    this.props.setSelectedFrequency(frequency)
    this.props.stepNext()
  }
}

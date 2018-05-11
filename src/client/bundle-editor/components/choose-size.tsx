import * as React from "react"
import styled from "styled-components"

interface Props {
  variants: ShopifyVariant[],
  selectedSize: number,
  setSelectedSize: (number) => any,
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

interface GridItemProps {
  selected: boolean
}

const GridItem = styled.div`
  border: ${({selected}: GridItemProps) => selected ? "1px solid red" : "1px solid transparent"};
  cursor: pointer;
`

export default class ChooseSize extends React.Component<Props> {
  public render() {
    const {
      selectedSize,
      stepPrev,
      variants,
    } = this.props

    return (
      <div>
        <h2 className="h3">Choose your size:</h2>
        <div className="grid grid--uniform">
          {variants.map((variant) => (
            <GridItem
              className="grid__item medium-up--one-half text-center"
              key={variant.id}
              onClick={this.setSelectedSize.bind(this, parseInt(variant.option1))}
              selected={selectedSize === parseInt(variant.option1)}
            >
              {variant.option1} for {variant.price}
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

  private setSelectedSize = (size) => {
    this.props.setSelectedSize(size)
    this.props.stepNext()
  }
}

import * as React from 'react'
import styled from 'styled-components'

interface Props {
  variants: ShopifyVariant[],
  selectedSize: number,
  setSelectedSize: (number) => any,
}

interface GridItemProps {
  selected: boolean
}

const GridItem = styled.div`
  border: ${({selected}: GridItemProps) => selected ? '1px solid red' : '1px solid transparent'};
  cursor: pointer;
`

export default class ChooseSize extends React.Component<Props> {
  render () {
    const {
      selectedSize,
      setSelectedSize,
      variants
    } = this.props

    return (
      <div>
        <h2 className='h3'>Choose your size:</h2>
        <div className='grid grid--uniform'>
          {variants.map(variant => (
            <GridItem
              className='grid__item medium-up--one-quarter text-center' 
              key={variant.id}
              onClick={setSelectedSize.bind(this, parseInt(variant.option1))}
              selected={selectedSize === parseInt(variant.option1)}
            >
              {variant.option1} for {variant.price}
            </GridItem>
          ))}
        </div>
      </div>
    )
  }
}
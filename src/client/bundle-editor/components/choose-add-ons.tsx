import * as React from 'react'

import {IProduct} from '../app'

interface IProps {
  addAddOnId: (number) => any,
  products: IProduct[],
  removeAddOnId: (number) => any,
  selectedAddOnIds: number[],
}

export default class ChooseAddOns extends React.Component<IProps> {
  render () {
    const {
      addAddOnId,
      products,
      removeAddOnId,
      selectedAddOnIds,
    } = this.props

    return (
      <div>
        <h2 className='h3'>Choose your add-ons:</h2>
        <div className='grid grid--uniform'>
        {products.map(({
            id: productId, 
            title, 
            image: {src}, 
            variants: [{id: variantId}]
          }) => (
            <div
              className='grid__item medium-up--one-third text-center' 
              key={productId}
            >
              <h3 className='h4'>{title}</h3>
              <img src={src} />
              <div>
                <button 
                  onClick={addAddOnId.bind(this, variantId)}
                  type='button'
                >
                  Add
                </button>
                <span>{selectedAddOnIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)}</span>
                <button 
                  onClick={removeAddOnId.bind(this, variantId)}
                  type='button'
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
import * as React from 'react'

import {
  IProduct,
  IVariant
} from '../app'

interface IProps {
  addVariantId: (IVariant) => any,
  products: IProduct[],
  removeVariantId: (IVariant) => any,
  selectedVariantIds: number[],
}

export default class ChooseProducts extends React.Component<IProps> {
  render () {
    const {
      addVariantId,
      products,
      removeVariantId,
      selectedVariantIds,
    } = this.props

    return (
      <div>
        <h2 className='h3'>Choose your products:</h2>
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
                  onClick={addVariantId.bind(this, variantId)}
                  type='button'
                >
                  Add
                </button>
                <span>{selectedVariantIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)}</span>
                <button 
                  onClick={removeVariantId.bind(this, variantId)}
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
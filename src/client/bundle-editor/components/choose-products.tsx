import * as React from 'react'

interface Props {
  addVariantId: (ShopifyVariant) => any,
  products: ShopifyProduct[],
  removeVariantId: (ShopifyVariant) => any,
  selectedVariantIds: number[],
}

export default class ChooseProducts extends React.Component<Props> {
  render () {
    const {
      addVariantId,
      products,
      removeVariantId,
      selectedVariantIds,
    } = this.props

    const productTypes = [...new Set(products.map(p => p.product_type))]

    return (
      <div>
        <h2 className='h3'>Choose your products:</h2>
        {productTypes.map(productType => (
          <div key={productType}>
            <h3 className='h4'>{productType}</h3>
            <div className='grid grid--uniform'>
              {products.filter(p => p.product_type === productType).map(({
                id: productId, 
                title, 
                image: {src}, 
                variants: [{
                  id: variantId,
                  price,
                }]
              }) => (
                <div
                  className='grid__item medium-up--one-third text-center' 
                  key={productId}
                >
                  <h3 className='h4'>{this.title({price, title})}</h3>
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
        ))}
      </div>
    )
  }

  title = ({price, title}) => {
    if (price === '0.00') return title
    return `${title} (+${price})`
  }
}
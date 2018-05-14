import * as React from "react"

import Progress from "./progress"

interface Props {
  addVariantId: (ShopifyVariant) => any,
  products: ShopifyProduct[],
  removeVariantId: (ShopifyVariant) => any,
  selectedSize: number,
  selectedVariantIds: number[],
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

export default class ChooseProducts extends React.Component<Props> {
  public render() {
    const {
      addVariantId,
      products,
      removeVariantId,
      selectedSize,
      selectedVariantIds,
      stepNext,
      stepPrev,
    } = this.props

    const productTypes = [...new Set(products.map((p) => p.product_type))]

    return (
      <div>
        <div className="grid grid--uniform">
          <div className="grid__item one-tenth">
            <button
              onClick={stepPrev}
              type="button"
            >
              Prev
            </button>
          </div>
          <div className="grid__item eight-tenths text-center">FILL YOUR BOX</div>
          <div className="grid__item one-tenth text-right">Filter</div>
        </div>

        <div className="grid grid--uniform">
          <div className="grid__item medium-up--two-thirds">
            <div>
              {productTypes.map((productType) => <span key={productType}>{productType}</span>)}
            </div>

            {productTypes.map((productType) => (
              <div key={productType}>
                <h3 className="h4">{productType}</h3>
                <div className="grid grid--uniform">
                  {products.filter((p) => p.product_type === productType).map(({
                    id: productId,
                    title,
                    image: {src},
                    variants: [{
                      id: variantId,
                      price,
                    }],
                  }) => (
                    <div
                      className="grid__item medium-up--one-third text-center"
                      key={productId}
                    >
                      <h3 className="h4">{this.title({price, title})}</h3>
                      <img src={src} />
                      <div>
                        <button
                          onClick={addVariantId.bind(this, variantId)}
                          type="button"
                        >
                          Add
                        </button>
                        <span>{selectedVariantIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)}</span>
                        <button
                          onClick={removeVariantId.bind(this, variantId)}
                          type="button"
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

          <div className="grid__item medium-up--one-third">
            <Progress />
          </div>
        </div>

        <div>
          <button
            onClick={stepPrev}
            type="button"
          >
            Prev
          </button>

          {selectedVariantIds.length === selectedSize && (
            <button
              onClick={stepNext}
              type="button"
            >
              Next
            </button>
          )}
        </div>
      </div>
    )
  }

  public title = ({price, title}) => {
    if (price === "0.00") { return title }
    return `${title} (+${price})`
  }
}

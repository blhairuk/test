import * as React from "react"

import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"
import ProductDetails from "./product-details"
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

interface State {
  productDetailsModalProductId: number,
}

const initialState = {
  productDetailsModalProductId: null,
}

export default class ChooseProducts extends React.Component<Props, State> {
  public state = initialState

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

    const {productDetailsModalProductId} = this.state

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
                      <h3 className="h4">
                        <a onClick={this.handleProductDetailsModalOpen.bind(this, productId)}>
                          {this.title({price, title})}
                        </a>
                      </h3>
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

        <Modal
          handleClose={this.handleProductDetailsModalClose}
          isOpen={!!productDetailsModalProductId}
        >
          <ProductDetails
            product={products.find(({id}) => id === productDetailsModalProductId)}
          />
        </Modal>
      </div>
    )
  }

  public title = ({price, title}) => {
    if (price === "0.00") { return title }
    return `${title} (+${price})`
  }

  private handleProductDetailsModalClose = () => {
    this.setState(updateStateKeys({productDetailsModalProductId: null}))
  }

  private handleProductDetailsModalOpen = (productDetailsModalProductId) => {
    this.setState(updateStateKeys({productDetailsModalProductId}))
  }
}

import * as React from "react"

import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"
import Button from "../styled/button"
import Filters from "./filters"
import ProductDetails from "./product-details"
import Progress from "./progress"

interface Props {
  addVariantId: (ShopifyVariant) => any,
  filters: any,
  products: ShopifyProduct[],
  removeVariantId: (ShopifyVariant) => any,
  selectedSize: number,
  selectedVariantIds: number[],
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

interface State {
  activeFilters: string[],
  isFiltersModalOpen: boolean,
  productDetailsModalProductId: number,
}

const initialState = {
  activeFilters: [],
  isFiltersModalOpen: false,
  productDetailsModalProductId: null,
}

export default class ChooseProducts extends React.Component<Props, State> {
  public state = initialState

  public render() {
    const {
      addVariantId,
      filters,
      products,
      removeVariantId,
      selectedSize,
      selectedVariantIds,
      stepNext,
      stepPrev,
    } = this.props

    const {
      activeFilters,
      isFiltersModalOpen,
      productDetailsModalProductId,
    } = this.state

    const productTypes = [...new Set(products.map((p) => p.product_type))]

    const renderProduct = ({
      id: productId,
      title,
      image: {src},
      variants,
    }) => {
      const {
        id: variantId,
        price,
      } = variants[0]

      const numSelected = selectedVariantIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)

      const renderButtons = () => {
        if (numSelected === 0) {
          return (
            <div>
              <Button
                onClick={addVariantId.bind(this, variantId)}
                type="button"
              >
                Add
              </Button>
            </div>
          )
        }

        return (
          <div>
            <button
              onClick={addVariantId.bind(this, variantId)}
              type="button"
            >
              Add
            </button>
            <span>{numSelected}</span>
            <button
              onClick={removeVariantId.bind(this, variantId)}
              type="button"
            >
              Del
            </button>
          </div>
        )
      }

      return (
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
          {renderButtons()}
        </div>
      )
    }

    const renderProductType = (productType) => {
      const renderableProducts = products
        .filter(({product_type, tags}) => (
          product_type === productType && (
            !activeFilters.length ? true : activeFilters.some((f) => tags.includes(f))
          )
        ))

      return (
        <div key={productType}>
          <h3 className="h4">{productType}</h3>
          <div className="grid grid--uniform">
            {renderableProducts.map(renderProduct)}
          </div>
        </div>
      )
    }

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
          <div className="grid__item one-tenth text-right">
            <button
              onClick={this.handleFiltersModalOpen}
              type="button"
            >
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid--uniform">
          <div className="grid__item medium-up--two-thirds">
            <div>
              {productTypes.map((productType) => <span key={productType}>{productType}</span>)}
            </div>

            {productTypes.map(renderProductType)}
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
          style="panel"
        >
          <ProductDetails
            product={products.find(({id}) => id === productDetailsModalProductId)}
          />
        </Modal>

        <Modal
          handleClose={this.handleFiltersModalClose}
          isOpen={isFiltersModalOpen}
          style="panel"
        >
          <Filters
            activeFilters={activeFilters}
            filters={filters}
            resetFilters={this.resetFilters}
            toggleFilter={this.toggleFilter}
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

  private handleFiltersModalClose = () => {
    this.setState(updateStateKeys({isFiltersModalOpen: false}))
  }

  private handleFiltersModalOpen = () => {
    this.setState(updateStateKeys({isFiltersModalOpen: true}))
  }

  private resetFilters = () => {
    this.setState(updateStateKeys({activeFilters: []}))
  }

  private toggleFilter = (filterTag) => {
    const {activeFilters} = this.state
    const index = activeFilters.indexOf(filterTag)
    if (index === -1) {
      activeFilters.push(filterTag)
    } else {
      activeFilters.splice(index, 1)
    }
    this.setState(updateStateKeys({activeFilters}))
  }
}

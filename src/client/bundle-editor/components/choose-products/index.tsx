import * as React from "react"

import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"
import Button from "../styled/button"
import Filters from "./filters"
import ProductDetails from "./product-details"
import Progress from "./progress"
import VideoHero from "./video-hero"

import {getMetafieldValue} from "../../../../shared/helpers"

interface Props {
  addVariantId: (productId: number, variantId: number) => () => any,
  bundleAddOns: ShopifyProduct[],
  bundleProducts: ShopifyProduct[],
  bundleProductMetafields: ShopifyProductMetafield[],
  filters: any,
  isActiveStep: boolean,
  removeVariantId: (productId: number, variantId: number) => () => any,
  selectedProductIds: number[],
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
      bundleAddOns,
      bundleProducts,
      bundleProductMetafields,
      filters,
      removeVariantId,
      selectedProductIds,
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

    const productTypes = [...new Set(bundleProducts.map((p) => p.product_type))]

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
                onClick={addVariantId(productId, variantId)}
                type="button"
              >
                Add
              </Button>
            </div>
          )
        }

        return (
          <div>
            <Button
              color="black"
              onClick={removeVariantId(productId, variantId)}
              type="button"
            >
              -
            </Button>

            <span style={{fontSize: "150%", fontWeight: "bold"}}>
              {numSelected}
            </span>

            <Button
              color="black"
              onClick={addVariantId(productId, variantId)}
              type="button"
            >
              +
            </Button>
          </div>
        )
      }

      return (
        <div
          className="grid__item medium-up--one-third text-center"
          key={productId}
        >
          <h3 className="h4">
            <a onClick={this.handleProductDetailsModalOpen(productId)}>
              {this.title({price, title})}
            </a>
          </h3>
          <img src={src} />
          {renderButtons()}
        </div>
      )
    }

    const renderProductType = (productType) => {
      const renderableProducts = bundleProducts
        .filter(({product_type, tags}) => (
          product_type === productType && (
            !activeFilters.length ? true : activeFilters.some((f) => tags.includes(f))
          )
        ))

      const metafieldKey = `youtube_id_${productType.toLowerCase().replace(/\s/g, "_")}`

      return (
        <div key={productType}>
          <VideoHero
            title={productType}
            youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", metafieldKey)}
          />
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
            <Progress
              bundleAddOns={bundleAddOns}
              bundleProducts={bundleProducts}
              selectedProductIds={selectedProductIds}
            />
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
            product={bundleProducts.find(({id}) => id === productDetailsModalProductId)}
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

  private handleProductDetailsModalOpen = (productDetailsModalProductId) => () => {
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

  private toggleFilter = (filterTag) => () => {
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

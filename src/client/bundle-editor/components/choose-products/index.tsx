import * as React from "react"

import {getMetafieldValue} from "../../../../shared/helpers"
import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"
import {Context as AppContext} from "../../app"
import Button from "../styled/button"
import Filters from "./filters"
import Product from "./product"
import Progress from "./progress"
import VideoHero from "./video-hero"

interface Props {
  isActiveStep: boolean,
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
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    bundleProducts,
    bundleProductMetafields,
    selectedSize,
    selectedVariantIds,
    stepNext,
    stepPrev,
  }) => {
    const {
      activeFilters,
      isFiltersModalOpen,
    } = this.state

    const filters = JSON.parse(
      getMetafieldValue(
        bundleProductMetafields,
        "bundle_editor",
        "filters",
      ),
    )

    const productTypes = [...new Set(bundleProducts.map((p) => p.product_type))]

    const renderProduct = (product) => {
      const {
        id: productId,
      } = product

      return (
        <div
          className="grid__item medium-up--one-third text-center"
          key={productId}
        >
          <Product product={product} />
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
            {productTypes.map(renderProductType)}
          </div>

          <div className="grid__item medium-up--one-third">
            <Progress />

            <Button
              color="purple"
              disabled={selectedVariantIds.length < selectedSize}
              onClick={stepNext}
              type="button"
            >
              Next
            </Button>
          </div>
        </div>

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

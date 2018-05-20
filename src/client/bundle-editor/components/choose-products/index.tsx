import * as React from "react"

import {getMetafieldValue} from "../../../../shared/helpers"
import Modal from "../../../helpers/modal"
import Sticky from "../../../helpers/sticky"
import updateStateKeys from "../../../helpers/update-state-keys"
import StepHeader from "../step-header"
import Button from "../styled/button"
import Filters from "./filters"
import Product from "./product"
import Progress from "./progress"
import VideoHero from "./video-hero"

interface Props {
  addAddOnId: (productId: number, variantId: number) => () => any,
  addVariantId: (productId: number, variantId: number) => () => any,
  allProducts: ShopifyProduct[],
  bundleName: string,
  bundleProducts: ShopifyProduct[],
  bundleProductMetafields: ShopifyProductMetafield[],
  isActiveStep: boolean,
  openProductDetailsModal: (productId: number) => any,
  openVideoModal: (youtubeId: string) => () => any,
  removeAddOnId: (productId: number, variantId: number) => () => any,
  removeVariantId: (productId: number, variantId: number) => () => any,
  selectedAddOnIds: number[],
  selectedProductIds: number[],
  selectedSize: number,
  selectedVariantIds: number[],
  stepNext: () => any,
  stepPrev: () => any,
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
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
      addAddOnId,
      addVariantId,
      bundleName,
      bundleProducts,
      bundleProductMetafields,
      openProductDetailsModal,
      openVideoModal,
      removeAddOnId,
      removeVariantId,
      selectedAddOnIds,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
      stepNext,
      stepPrev,
      updateBundleName,
    } = this.props

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
            openVideoModal={openVideoModal}
            title={productType}
            youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", metafieldKey)}
          />
          <div className="grid grid--uniform">
            {renderableProducts.map((product) => (
              <div
                className="grid__item medium-up--one-third text-center"
                key={product.id}
              >
                <Product
                  addAddOnId={addAddOnId}
                  addVariantId={addVariantId}
                  isAddOn={false}
                  openProductDetailsModal={openProductDetailsModal}
                  product={product}
                  removeAddOnId={removeAddOnId}
                  removeVariantId={removeVariantId}
                  selectedAddOnIds={selectedAddOnIds}
                  selectedVariantIds={selectedVariantIds}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div>
        <StepHeader
          rightSection={
            <button
              onClick={this.handleFiltersModalOpen}
              type="button"
            >
              Filters
            </button>
          }
          stepPrev={stepPrev}
          title="FILL YOUR BOX"
        />

        <div className="grid grid--uniform">
          <div className="grid__item medium-up--two-thirds">
            {productTypes.map(renderProductType)}
          </div>

          <div className="grid__item medium-up--one-third">
            <Sticky offset={180}>
              <Progress
                bundleName={bundleName}
                bundleProducts={bundleProducts}
                removeVariantId={removeVariantId}
                selectedProductIds={selectedProductIds}
                selectedVariantIds={selectedVariantIds}
                selectedSize={selectedSize}
                updateBundleName={updateBundleName}
              />

              <Button
                color="purple"
                disabled={selectedVariantIds.length < selectedSize}
                onClick={stepNext}
                type="button"
              >
                Next
              </Button>
            </Sticky>
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

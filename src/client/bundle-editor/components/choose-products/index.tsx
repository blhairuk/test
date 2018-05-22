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

import {BACKGROUND_BLACK} from "../../../colors"

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
  isActiveStep: boolean,
  isFiltersModalOpen: boolean,
  productDetailsModalProductId: number,
  productTypes: string[],
}

export default class ChooseProducts extends React.Component<Props, State> {
  public state = {
    activeFilters: [],
    isActiveStep: false,
    isFiltersModalOpen: false,
    productDetailsModalProductId: null,
    productTypes: [],
  }

  private productTypeRefs = {}

  constructor(props) {
    super(props)

    this.state.productTypes = [...new Set(props.bundleProducts.map((p) => p.product_type))]

    this.state.productTypes.forEach((productType) => {
      this.productTypeRefs[productType] = React.createRef()
    })
  }

  public render() {
    const {
      addAddOnId,
      addVariantId,
      bundleName,
      bundleProducts,
      bundleProductMetafields,
      isActiveStep,
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
      productTypes,
    } = this.state

    const filters = JSON.parse(
      getMetafieldValue(
        bundleProductMetafields,
        "bundle_editor",
        "filters",
      ),
    )

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

        <div
          style={{
            backgroundColor: BACKGROUND_BLACK,
            padding: "10px 0",
          }}
        >
          {productTypes.map((productType) => (
            <span
              key={productType}
              style={{
                paddingRight: "10px",
              }}
            >
              <a
                onClick={this.handleProductTypeClick(productType)}
                style={{padding: "5px"}}
              >
                {productType.toUpperCase()}
              </a>
            </span>
          ))}
        </div>

        <div className="grid grid--uniform">
          <div className="grid__item medium-up--three-fifths">
            {productTypes.map((productType) => {
              const renderableProducts = bundleProducts
                .filter(({product_type, tags}) => (
                  product_type === productType && (
                    !activeFilters.length ? true : activeFilters.some((f) => tags.includes(f))
                  )
                ))

              // hide the entire section if there are no products in the filters
              if (renderableProducts.length === 0) { return null }

              const metafieldKey = `youtube_id_${productType.toLowerCase().replace(/\s/g, "_")}`

              return (
                <div
                  key={productType}
                  ref={this.productTypeRefs[productType]}
                >
                  <VideoHero
                    openVideoModal={openVideoModal}
                    title={productType.toUpperCase()}
                    youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", metafieldKey)}
                  />
                  <div className="grid grid--uniform">
                    {renderableProducts.map((product) => (
                      <div
                        className="grid__item one-half medium-up--one-third text-center"
                        key={product.id}
                        style={{
                          paddingBottom: "25px",
                          paddingTop: "25px",
                        }}
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
            })}
          </div>

          <div className="grid__item medium-up--two-fifths">
            <Sticky
              disabled={!isActiveStep}
              offset={42} /* product types header height */
            >
              <div className="hide medium-up--show">
                <Progress
                  bundleName={bundleName}
                  bundleProducts={bundleProducts}
                  removeVariantId={removeVariantId}
                  selectedProductIds={selectedProductIds}
                  selectedVariantIds={selectedVariantIds}
                  selectedSize={selectedSize}
                  updateBundleName={updateBundleName}
                />
              </div>

              <div className="text-center">
                <Button
                  color="purple"
                  disabled={selectedVariantIds.length < selectedSize}
                  onClick={stepNext}
                  type="button"
                >
                  Next
                </Button>
              </div>
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

  private handleProductTypeClick = (productType) => () => {
    const ref = this.productTypeRefs[productType].current

    window.scrollTo({
      behavior: "smooth",
      top: ref.offsetTop + 90, // header height
    })
  }
}

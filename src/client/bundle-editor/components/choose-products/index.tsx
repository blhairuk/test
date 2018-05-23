import * as React from "react"
import * as StickyNode from "react-stickynode"

import {
  getMetafieldValue,
  getPathToImages,
} from "../../../../shared/helpers"

import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"
import StepHeader from "../step-header"
import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"
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
  activeProductType: string,
  isActiveStep: boolean,
  isFiltersModalOpen: boolean,
  productDetailsModalProductId: number,
  productTypes: string[],
}

export default class ChooseProducts extends React.Component<Props, State> {
  public state = {
    activeFilters: [],
    activeProductType: null,
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

    this.state.activeProductType = this.state.productTypes[0]
  }

  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

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
      activeProductType,
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
      <div style={{minWidth: "0"}}>
        <div id="hh-sticky-header">
          <StickyNode innerZ={2}>
            <StepHeader
              rightSection={
                <a
                  href="javascript:void(0)"
                  onClick={this.handleFiltersModalOpen}
                  style={{display: "block"}}
                >
                  <FlexWrapper>
                    <img src={getPathToImages("icon-filter.svg")} />
                    <small className="hide medium-up--show">FILTER</small>
                  </FlexWrapper>
                </a>
              }
              stepPrev={stepPrev}
              title="FILL YOUR BOX"
            />

            <div
              style={{
                backgroundColor: BACKGROUND_BLACK,
                overflowX: "scroll",
                padding: "10px 0",
                whiteSpace: "nowrap",
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
                    href="javascript:void(0)"
                    onClick={this.handleProductTypeClick(productType)}
                    style={{
                      borderBottomStyle: "solid",
                      borderBottomWidth: "3px",
                      borderColor: activeProductType === productType ? "orange" : "transparent",
                      padding: "5px",
                    }}
                  >
                    {productType.toUpperCase()}
                  </a>
                </span>
              ))}
            </div>
          </StickyNode>
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
            <StickyNode top="#hh-sticky-header">
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
            </StickyNode>
          </div>
        </div>

        <Modal
          handleClose={this.handleFiltersModalClose}
          isOpen={isFiltersModalOpen}
          style="panel"
        >
          <Filters
            activeFilters={activeFilters}
            closeModal={this.handleFiltersModalClose}
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

  private handleScroll = () => {
    const {
      productTypes,
    } = this.state

    const pageYOffset = window.pageYOffset

    let activeProductType = productTypes[0]

    for (const productType of productTypes) {
      const ref = this.productTypeRefs[productType].current
      if (pageYOffset >= ref.offsetTop) {
        activeProductType = productType
      }
    }

    this.setState(updateStateKeys({activeProductType}))
  }
}

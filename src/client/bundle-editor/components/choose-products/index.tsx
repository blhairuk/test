import {Box, Flex} from "grid-styled"
import * as React from "react"
import * as StickyNode from "react-stickynode"

import {
  frequencyTitle,
  getMetafieldValue,
  getPathToImages,
  pluralizeProductType,
} from "../../../../shared/helpers"

import {extractNameFromTag} from "../../../helpers/filters"
import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"
import StepHeader from "../step-header"
import Button from "../styled/button"
import Filters from "./filters"
import Product from "./product"
import Progress from "./progress"
import VideoHero from "./video-hero"

import {
  BACKGROUND_BLACK,
} from "../../../colors"

interface Props {
  addAddOnId: (productId: number, variantId: number) => () => any,
  addVariantId: (productId: number, variantId: number) => () => any,
  allProducts: ShopifyProduct[],
  bundleName: string,
  bundleProducts: ShopifyProduct[],
  bundleProductMetafields: ShopifyProductMetafield[],
  frequencyUnitType: string,
  isActiveStep: boolean,
  openProductDetailsModal: (productId: number) => any,
  openVideoModal: (youtubeId: string) => () => any,
  removeAddOnId: (productId: number, variantId: number) => () => any,
  removeVariantId: (productId: number, variantId: number) => () => any,
  selectedAddOnIds: number[],
  selectedBundlePrice: number,
  selectedFrequency: number,
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
  productTypeRefs: {string?: React.RefObject<HTMLElement>},
  productTypes: string[],
}

const FIXED_HEADER_HEIGHT = 102

export default class ChooseProducts extends React.Component<Props, State> {
  public static getDerivedStateFromProps(props, state) {
    if (!state.productTypes) {
      state.productTypes = [...new Set(props.bundleProducts.map((p) => p.product_type))].reverse()

      state.productTypes.forEach((productType) => {
        state.productTypeRefs[productType] = React.createRef()
      })

      state.activeProductType = state.productTypes[0]
    }

    return state
  }

  public state = {
    activeFilters: [],
    activeProductType: null,
    isActiveStep: false,
    isFiltersModalOpen: false,
    productDetailsModalProductId: null,
    productTypeRefs: {},
    productTypes: null,
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
      frequencyUnitType,
      openProductDetailsModal,
      openVideoModal,
      removeAddOnId,
      removeVariantId,
      selectedAddOnIds,
      selectedBundlePrice,
      selectedFrequency,
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
      productTypeRefs,
      productTypes,
    } = this.state

    const filters = JSON.parse(
      getMetafieldValue(
        bundleProductMetafields,
        "bundle_editor",
        "filters",
      ),
    )

    const filteredProducts = activeFilters.length === 0
      ? bundleProducts
      : bundleProducts.filter(({tags}) => activeFilters.some((f) => tags.includes(f)))

    return (
      <div
        className="one-whole"
        style={{minWidth: "0"}}
      >
        <div
          id="hh-sticky-header"
          style={{marginBottom: "10px"}}
        >
          <StickyNode innerZ={2}>
            <StepHeader
              centerSection={
                <div>
                  <div className="medium-up--hide">
                    <div>{bundleName.toUpperCase()}</div>
                    <div>
                      {frequencyTitle(frequencyUnitType, selectedFrequency)}
                      <span>&nbsp;&bull;&nbsp;</span>
                      ${selectedBundlePrice}
                      <span>&nbsp;&bull;&nbsp;</span>
                      {selectedVariantIds.length} of {selectedSize}
                    </div>
                  </div>
                  <div className="hide medium-up--show">
                    <h1 style={{fontSize: "160%", marginBottom: "0"}}>FILL YOUR BOX</h1>
                  </div>
                </div>
              }
              rightSection={
                <a
                  href="javascript:void(0)"
                  onClick={this.handleFiltersModalOpen}
                  style={{display: "block"}}
                >
                  <Flex alignItems="center">
                    <img src={getPathToImages("icon-filter.svg")} />
                    <Box className="hide medium-up--show">
                      <small>FILTER</small>
                    </Box>
                  </Flex>
                </a>
              }
              stepPrev={stepPrev}
            />

            <div
              style={{
                backgroundColor: BACKGROUND_BLACK,
                overflowX: "auto",
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
                    {pluralizeProductType(productType).toUpperCase()}
                  </a>
                </span>
              ))}
            </div>
          </StickyNode>
        </div>

        {activeFilters.length > 0 && (
          <div style={{padding: "10px 0"}}>
            {activeFilters.map((filter) => (
              <Filter
                color="yellow"
                key="filter"
                onClick={this.toggleFilter(filter)}
              >
                {extractNameFromTag(filter)} X
              </Filter>
            ))}
          </div>
        )}

        <Flex
          flexWrap="wrap"
          mx={-2}
        >
          <Box
            px={2}
            width={[1, 3 / 5]}
          >
            {productTypes.map((productType) => {
              const renderableProducts = filteredProducts.filter(({product_type}) => product_type === productType)

              // hide the entire section if there are no products in the filters
              if (renderableProducts.length === 0) { return null }

              const metafieldKey = `youtube_id_${productType.toLowerCase().replace(/\s/g, "_")}`

              return (
                <div
                  key={productType}
                  ref={productTypeRefs[productType]}
                >
                  <VideoHero
                    backgroundImage={getPathToImages(`hero-${productType.replace(/\s/g, "-").toLowerCase()}.jpg`)}
                    openVideoModal={openVideoModal}
                    title={pluralizeProductType(productType).toUpperCase()}
                    youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", metafieldKey)}
                  />
                  <Flex
                    flexWrap="wrap"
                    mb={3}
                    mx={-2}
                  >
                    {renderableProducts.map((product) => (
                      <Box
                        className="text-center"
                        key={product.id}
                        px={2}
                        py={2}
                        width={[1 / 2, 1 / 3]}
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
                      </Box>
                    ))}
                  </Flex>
                </div>
              )
            })}
          </Box>

          <Box
            px={2}
            width={[1, 2 / 5]}
          >
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

              <div
                className="text-center"
                style={{marginBottom: "20px"}}
              >
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
          </Box>
        </Flex>

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
    const ref = this.state.productTypeRefs[productType].current

    window.scrollTo({
      behavior: "smooth",
      top: ref.offsetTop - FIXED_HEADER_HEIGHT,
    })
  }

  private handleScroll = () => {
    const {
      productTypeRefs,
      productTypes,
    } = this.state

    const pageYOffset = window.pageYOffset

    let activeProductType = productTypes[0]

    for (const productType of productTypes) {
      const ref = productTypeRefs[productType].current
      if (ref && (pageYOffset + FIXED_HEADER_HEIGHT >= ref.offsetTop)) {
        activeProductType = productType
      }
    }

    this.setState(updateStateKeys({activeProductType}))
  }
}

const Filter = Button.extend`
  font-weight: bold;
  margin-bottom: 5px;
  margin-right: 10px;
`

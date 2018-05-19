import * as React from "react"

import bindStateHelper from "./app/state-helper"

import ChooseAddOns from "./components/choose-add-ons"
import ChooseFrequencySize from "./components/choose-frequency-size"
import ChooseProducts from "./components/choose-products"
import ProductDetails from "./components/choose-products/product-details"
import Confirm from "./components/confirm"
import EnterEmail from "./components/enter-email"
import EnterName from "./components/enter-name"
import ResponsiveEmbed from "./components/styled/responsive-embed"

import AppContainer from "./components/styled/app-container"
import Step from "./components/styled/step"

import Modal from "../helpers/modal"

import {
  createBundleId,
  createIdQuantities,
  getMetafieldValue,
  getPropertyValueForKey,
} from "../../shared/helpers"

import updateStateKeys from "../helpers/update-state-keys"

import {
  addToCart,
  fetchCart,
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from "../helpers/cart"

import {BUNDLE_TYPE} from "../../shared/constants"

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleId: number,
  bundleProductMetafields: ShopifyProductMetafield[],
  bundleProduct: ShopifyProduct,
  bundleProducts: ShopifyProduct[],
  customerHash: string,
  subscriptions: RechargeSubscription[],
}

interface State {
  bundleName: string,
  currentStepIndex: number,
  editingBundleId: number,
  enteredEmail: string,
  enteredName: string,
  isBundleFullModalOpen: boolean,
  isSubmitting: boolean,
  productDetailsModalProductId: number,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedProductIds: number[],
  selectedVariantIds: number[],
  selectedSize: number,
  videoModalYouTubeId: number,
}

export default class App extends React.Component<Props, State> {
  public state = {
    bundleName: "",
    currentStepIndex: null,
    editingBundleId: null,
    enteredEmail: "",
    enteredName: "",
    isBundleFullModalOpen: false,
    isSubmitting: false,
    productDetailsModalProductId: null,
    selectedAddOnIds: [],
    selectedFrequency: null,
    selectedProductIds: [],
    selectedSize: null,
    selectedVariantIds: [],
    videoModalYouTubeId: null,
  }

  private stateHelper
  private slickRef

  constructor(props) {
    super(props)

    this.stateHelper = bindStateHelper(this)

    if (props.subscriptions) {
      const cartState = this.extractStateFromSubscriptions()
      this.state = updateStateKeys(cartState)(this.state)
    }
  }

  public async componentDidMount() {
    const {
      bundleId,
      customerHash,
    } = this.props

    if (bundleId && !customerHash) {
      const cartState = await this.extractStateFromCart(bundleId)
      this.setState(updateStateKeys(cartState))
    }

    this.initSlick()
  }

  public render() {
    const {
      bundleAddOns,
      bundleProduct,
      bundleProductMetafields,
      bundleProducts,
    } = this.props

    const {
      currentStepIndex,
      isBundleFullModalOpen,
      productDetailsModalProductId,
      videoModalYouTubeId,
    } = this.state

    const {
      bundleName,
      editingBundleId,
      enteredEmail,
      enteredName,
      isSubmitting,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
    } = this.state

    const allProducts = bundleProducts.concat(bundleAddOns)
    const isEditingSubscription = this.isEditingSubscription()

    return (
      <>
        <AppContainer>
          <div className="bu-slick">
            {!isEditingSubscription && (
              <>
                <div>
                  <Step>
                    <EnterName
                      enterName={this.stateHelper.enterName}
                      enteredName={enteredName}
                      isActiveStep={currentStepIndex === 0}
                      stepNext={this.stepNext}
                    />
                  </Step>
                </div>
                <div>
                  <Step>
                    <EnterEmail
                      enterEmail={this.stateHelper.enterEmail}
                      enteredEmail={enteredEmail}
                      enteredName={enteredName}
                      isActiveStep={currentStepIndex === 1}
                      stepNext={this.stepNext}
                      stepPrev={this.stepPrev}
                    />
                  </Step>
                </div>
              </>
            )}
            <div>
              <Step>
                <ChooseFrequencySize
                  bundleProduct={bundleProduct}
                  bundleProductMetafields={bundleProductMetafields}
                  isActiveStep={currentStepIndex === 2}
                  isEditingSubscription={isEditingSubscription}
                  selectedFrequency={selectedFrequency}
                  setSelectedFrequency={this.stateHelper.setSelectedFrequency}
                  selectedSize={selectedSize}
                  setSelectedSize={this.stateHelper.setSelectedSize}
                  stepNext={this.stepNext}
                  stepPrev={this.stepPrev}
                />
              </Step>
            </div>
            <div>
              <Step align="top">
                <div className="one-whole">
                  <ChooseProducts
                    addAddOnId={this.stateHelper.addAddOnId}
                    addVariantId={this.stateHelper.addVariantId}
                    allProducts={allProducts}
                    bundleName={bundleName}
                    bundleProducts={bundleProducts}
                    bundleProductMetafields={bundleProductMetafields}
                    isActiveStep={currentStepIndex === 3}
                    openProductDetailsModal={this.openProductDetailsModal}
                    openVideoModal={this.openVideoModal}
                    removeAddOnId={this.stateHelper.removeAddOnId}
                    removeVariantId={this.stateHelper.removeVariantId}
                    selectedAddOnIds={selectedAddOnIds}
                    selectedProductIds={selectedProductIds}
                    selectedSize={selectedSize}
                    selectedVariantIds={selectedVariantIds}
                    stepNext={this.stepNext}
                    stepPrev={this.stepPrev}
                    updateBundleName={this.stateHelper.updateBundleName}
                  />
                </div>
              </Step>
            </div>
            <div>
              <Step align="top">
                <div className="one-whole">
                  <ChooseAddOns
                    addAddOnId={this.stateHelper.addAddOnId}
                    addVariantId={this.stateHelper.addVariantId}
                    bundleAddOns={bundleAddOns}
                    bundleProductMetafields={bundleProductMetafields}
                    bundleProducts={bundleProducts}
                    isActiveStep={currentStepIndex === 4}
                    openProductDetailsModal={this.openProductDetailsModal}
                    openVideoModal={this.openVideoModal}
                    removeAddOnId={this.stateHelper.removeAddOnId}
                    removeVariantId={this.stateHelper.removeVariantId}
                    selectedAddOnIds={selectedAddOnIds}
                    selectedVariantIds={selectedVariantIds}
                    stepNext={this.stepNext}
                    stepPrev={this.stepPrev}
                  />
                </div>
              </Step>
            </div>
            <div>
              <Step align="top">
                <div className="one-whole">
                  <Confirm
                    allProducts={allProducts}
                    isActiveStep={currentStepIndex === 5}
                    isEditingBundle={!!editingBundleId}
                    isSubmitting={isSubmitting}
                    selectedFrequency={selectedFrequency}
                    selectedProductIds={selectedProductIds}
                    selectedSize={selectedSize}
                    stepPrev={this.stepPrev}
                    submit={this.submit}
                  />
                </div>
              </Step>
            </div>
          </div>

          <Modal
            handleClose={this.handleBundleFullModalClose}
            isOpen={isBundleFullModalOpen}
          >
            Your bundle is full!
          </Modal>
        </AppContainer>

        <Modal
          handleClose={this.closeProductDetailsModal}
          isOpen={!!productDetailsModalProductId}
          style="panel"
        >
          {productDetailsModalProductId && (
            <ProductDetails
              closeProductDetailsModal={this.closeProductDetailsModal}
              product={allProducts.find(({id}) => id === productDetailsModalProductId)}
            />
          )}
        </Modal>

        <Modal
          handleClose={this.closeVideoModal}
          isOpen={!!videoModalYouTubeId}
        >
          <ResponsiveEmbed>
            <iframe
              allowFullScreen={true}
              frameBorder={0}
              height={360}
              src={`https://www.youtube.com/embed/${videoModalYouTubeId}?autoplay=1`}
              width={640}
            />
          </ResponsiveEmbed>
        </Modal>
      </>
    )
  }

  protected createBundleName = (customerName) => `${customerName}'s box`

  private addToCart = (bundleId, extraData) => {
    const {bundleProductMetafields} = this.props

    const shipping_interval_unit_type = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_unit_type",
    )
    const subscription_id = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "subscription_id",
    )

    return addToCart({
      ...extraData,
      properties: {
        bundle_id: bundleId,
        shipping_interval_frequency: this.state.selectedFrequency,
        shipping_interval_unit_type,
        subscription_id,
        ...extraData.properties,
      },
    })
  }

  private submit = async () => {
    this.setState(updateStateKeys({isSubmitting: true}))

    const {
      bundleId,
      customerHash,
    } = this.props

    if (bundleId && customerHash) {
      await this.submitCustomerBundleUpdates()
    } else {
      await this.submitCartBundleUpdates()
    }

    this.setState(updateStateKeys({isSubmitting: false}))
  }

  private submitCustomerBundleUpdates = async () => {
    const {
      bundleName,
      enteredEmail,
      enteredName,
      selectedAddOnIds,
      selectedFrequency,
      selectedSize,
      selectedVariantIds,
    } = this.state

    const data = {
      add_on_ids: selectedAddOnIds,
      bundle_name: bundleName,
      customer_name: enteredName,
      email: enteredEmail,
      frequency: selectedFrequency,
      size: selectedSize,
      variant_ids: selectedVariantIds,
    }

    await $.ajax({
      contentType: "application/json",
      data: JSON.stringify(data),
      dataType: "json",
      method: "PUT",
      url: window.location.pathname,
    })
  }

  private submitCartBundleUpdates = async () => {
    const {bundleProduct} = this.props

    const {
      bundleName,
      editingBundleId,
      enteredEmail,
      enteredName,
      selectedAddOnIds,
      selectedSize,
      selectedVariantIds,
    } = this.state

    if (editingBundleId) {
      await removeBundleIdFromCart(editingBundleId)
    }

    const sizeVariantId = bundleProduct.variants
      .find((v) => parseInt(v.option1, 10) === selectedSize)
      .id
    const bundleId = editingBundleId || createBundleId()
    const idQuantities = createIdQuantities(selectedVariantIds.concat(selectedAddOnIds))

    await this.addToCart(bundleId, {
      id: sizeVariantId,
      properties: {
        bundle_customer_name: enteredName,
        bundle_email: enteredEmail,
        bundle_name: bundleName,
      },
      quantity: 1,
    })

    for (const id in idQuantities) {
      if (idQuantities.hasOwnProperty(id)) {
        await this.addToCart(bundleId, {
          id,
          quantity: idQuantities[id],
        })
      }
    }

    updateCartDrawerUI()

    this.setState(updateStateKeys({editingBundleId: bundleId}))
  }

  private extractStateFromCart = async (bundleId) => {
    const {
      bundleAddOns,
      bundleProducts,
    } = this.props

    const cart = await fetchCart()

    let bundleName = ""
    let enteredEmail = ""
    let enteredName = ""
    const selectedAddOnIds = []
    let selectedFrequency = null
    const selectedProductIds = []
    let selectedSize = null
    const selectedVariantIds = []

    for (const item of cart.items) {
      const {
        properties: {
          bundle_customer_name,
          bundle_email,
          bundle_id: itemBundleId,
          bundle_name,
          shipping_interval_frequency: frequency,
        },
        product_id,
        product_type: productType,
        quantity,
        variant_id: variantId,
        variant_options: [size],
      } = item

      if (itemBundleId === bundleId) {
        if (productType === BUNDLE_TYPE) {
          enteredEmail = bundle_email
          bundleName = bundle_name
          enteredName = bundle_customer_name
          selectedSize = parseInt(size, 10)
          selectedFrequency = frequency
        } else {
          const selectedArray = (() => {
            if (bundleAddOns.some((p) => p.id === product_id)) { return selectedAddOnIds }
            if (bundleProducts.some((p) => p.id === product_id)) { return selectedVariantIds }
          })()
          if (selectedArray) {
            for (let i = 0; i < quantity; ++i) {
              selectedArray.push(variantId)
              selectedProductIds.push(product_id)
            }
          }
        }
      }
    }

    return {
      bundleName,
      editingBundleId: bundleId,
      enteredEmail,
      enteredName,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
    }
  }

  private extractStateFromSubscriptions = () => {
    const {
      bundleAddOns,
      bundleId,
      bundleProduct,
      bundleProducts,
      subscriptions,
    } = this.props

    let bundleName = ""
    let enteredEmail = ""
    let enteredName = ""
    const selectedAddOnIds = []
    let selectedFrequency = null
    const selectedProductIds = []
    let selectedSize = null
    const selectedVariantIds = []

    for (const {
      order_interval_frequency,
      properties,
      quantity,
      shopify_product_id,
      shopify_variant_id,
    } of subscriptions) {
      if (shopify_product_id === bundleProduct.id) {
        bundleName = getPropertyValueForKey(properties, "bundle_name")
        enteredEmail = getPropertyValueForKey(properties, "bundle_email")
        enteredName = getPropertyValueForKey(properties, "bundle_customer_name")
        selectedFrequency = parseInt(order_interval_frequency, 10)
        selectedSize = parseInt(bundleProduct.variants.find((v) => v.id === shopify_variant_id).option1, 10)
      } else {
        const selectedArray = (() => {
          if (bundleAddOns.some((p) => p.id === shopify_product_id)) { return selectedAddOnIds }
          if (bundleProducts.some((p) => p.id === shopify_product_id)) { return selectedVariantIds }
        })()
        if (selectedArray) {
          for (let i = 0; i < quantity; ++i) {
            selectedArray.push(shopify_variant_id)
            selectedProductIds.push(shopify_product_id)
          }
        }
      }
    }

    return {
      bundleName,
      editingBundleId: bundleId,
      enteredEmail,
      enteredName,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
    }
  }

  private stepNext = (e?: React.FormEvent<HTMLElement>) => {
    if (e) { e.preventDefault() }
    this.slickRef.slick("slickNext")
  }

  private stepPrev = (e?: React.FormEvent<HTMLElement>) => {
    if (e) { e.preventDefault() }
    this.slickRef.slick("slickPrev")
  }

  private handleBundleFullModalClose = () => {
    this.setState(updateStateKeys({isBundleFullModalOpen: false}))
  }

  private isEditingSubscription = () => !!(this.props.customerHash && this.props.subscriptions)

  private initSlick = () => {
    const offset = this.isEditingSubscription ? 2 : 0

    $(() => {
      this.slickRef = $(".bu-slick")
      .on("init afterChange", (_, {currentSlide}) => {
        this.setState(updateStateKeys({currentStepIndex: currentSlide + offset}))
      })
      .slick({
        accessibility: false,
        adaptiveHeight: true,
        arrows: false,
        draggable: false,
        infinite: false,
        swipe: false,
        touchMove: false,
      })
    })
  }

  private closeProductDetailsModal = () => {
    this.setState(updateStateKeys({productDetailsModalProductId: null}))
  }

  private openProductDetailsModal = (productDetailsModalProductId) => () => {
    this.setState(updateStateKeys({productDetailsModalProductId}))
  }

  private openVideoModal = (videoModalYouTubeId) => () => {
    this.setState(updateStateKeys({videoModalYouTubeId}))
  }

  private closeVideoModal = () => {
    this.setState(updateStateKeys({videoModalYouTubeId: null}))
  }
}

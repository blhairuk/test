import * as React from "react"

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

const initialState = {
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

export const Context = React.createContext()

export default class App extends React.Component<Props, State> {
  public state = initialState
  private slickRef

  constructor(props) {
    super(props)

    if (props.subscriptions) {
      const cartState = this.extractStateFromSubscriptions()
      this.state = updateStateKeys(cartState)(initialState)
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
      bundleProducts,
      bundleProductMetafields,
    } = this.props

    const {
      bundleName,
      currentStepIndex,
      editingBundleId,
      enteredEmail,
      enteredName,
      isBundleFullModalOpen,
      isSubmitting,
      productDetailsModalProductId,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
      videoModalYouTubeId,
    } = this.state

    const allProducts = bundleProducts.concat(bundleAddOns)

    const contextValue = {
      addAddOnId: this.addAddOnId,
      addVariantId: this.addVariantId,
      allProducts,
      bundleAddOns,
      bundleName,
      bundleProduct,
      bundleProductMetafields,
      bundleProducts,
      closeProductDetailsModal: this.closeProductDetailsModal,
      closeVideoModal: this.closeVideoModal,
      enterEmail: this.enterEmail,
      enterName: this.enterName,
      enteredEmail,
      enteredName,
      isEditingBundle: !!editingBundleId,
      isSubmitting,
      openProductDetailsModal: this.openProductDetailsModal,
      openVideoModal: this.openVideoModal,
      removeAddOnId: this.removeAddOnId,
      removeVariantId: this.removeVariantId,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      selectedVariantIds,
      setSelectedFrequency: this.setSelectedFrequency,
      setSelectedSize: this.setSelectedSize,
      stepNext: this.stepNext,
      stepPrev: this.stepPrev,
      submit: this.submit,
      updateBundleName: this.updateBundleName,
    }

    return (
      <Context.Provider value={contextValue}>
        <AppContainer>
          <div className="bu-slick">
            <div>
              <Step>
                <EnterName isActiveStep={currentStepIndex === 0} />
              </Step>
            </div>
            <div>
              <Step>
                <EnterEmail isActiveStep={currentStepIndex === 1} />
              </Step>
            </div>
            <div>
              <Step>
                <ChooseFrequencySize isActiveStep={currentStepIndex === 2} />
              </Step>
            </div>
            <div>
              <Step align="top">
                <ChooseProducts isActiveStep={currentStepIndex === 3} />
              </Step>
            </div>
            <div>
              <Step align="top">
                <ChooseAddOns isActiveStep={currentStepIndex === 4} />
              </Step>
            </div>
            <div>
              <Step align="top">
                <Confirm isActiveStep={currentStepIndex === 5} />
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
      </Context.Provider>
    )
  }

  private enterEmail = ({target: {value: enteredEmail}}) => {
    this.setState(updateStateKeys({enteredEmail}))
  }

  private enterName = ({target: {value: enteredName}}) => {
    this.setState(updateStateKeys({
      bundleName: enteredName ? this.createBundleName(enteredName) : "",
      enteredName,
    }))
  }

  private updateBundleName = ({target: {value: bundleName}}) => {
    this.setState(updateStateKeys({bundleName}))
  }

  private setSelectedFrequency = (selectedFrequency) => () => {
    this.setState(updateStateKeys({selectedFrequency}))
  }

  private setSelectedSize = (selectedSize) => () => {
    const {selectedVariantIds} = this.state

    selectedVariantIds.splice(selectedSize)

    this.setState(updateStateKeys({
      selectedSize,
      selectedVariantIds,
    }))
  }

  private addVariantId = (productId, variantId) => () => {
    const {
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
    } = this.state

    if (!selectedSize) {
      return alert("You must selected a size first.")
    }

    if (selectedVariantIds.length >= selectedSize) {
      return this.setState(updateStateKeys({isBundleFullModalOpen: true}))
    }

    selectedProductIds.push(productId)
    selectedVariantIds.push(variantId)

    this.setState(updateStateKeys({selectedProductIds, selectedVariantIds}))
  }

  private removeVariantId = (productId, variantId) => () => {
    const {
      selectedProductIds,
      selectedVariantIds,
    } = this.state

    selectedProductIds.splice(selectedProductIds.indexOf(productId), 1)
    selectedVariantIds.splice(selectedVariantIds.indexOf(variantId), 1)

    this.setState(updateStateKeys({selectedProductIds, selectedVariantIds}))
  }

  private addAddOnId = (productId, variantId) => () => {
    const {selectedSize} = this.state

    let {
      selectedAddOnIds,
      selectedProductIds,
    } = this.state

    if (!selectedSize) {
      return alert("You must select a size first.")
    }

    selectedAddOnIds = selectedAddOnIds.concat([...Array(selectedSize)].map(() => variantId))
    selectedProductIds = selectedProductIds.concat([...Array(selectedSize)].map(() => productId))

    this.setState(updateStateKeys({selectedAddOnIds, selectedProductIds}))
  }

  private removeAddOnId = (productId, variantId) => () => {
    const {
      selectedAddOnIds,
      selectedProductIds,
      selectedSize,
    } = this.state

    for (let i = 0; i < (selectedSize || 1); ++i) {
      selectedAddOnIds.splice(selectedAddOnIds.indexOf(variantId), 1)
      selectedProductIds.splice(selectedProductIds.indexOf(productId), 1)
    }

    this.setState(updateStateKeys({selectedAddOnIds, selectedProductIds}))
  }

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

  private createBundleName = (customerName) => `${customerName}'s box`

  private initSlick = () => {
    $(() => {
      this.slickRef = $(".bu-slick")
      .on("init", (_, {currentSlide: currentStepIndex}) => {
        this.setState(updateStateKeys({currentStepIndex}))
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
      .on("afterChange", (_, {currentSlide: currentStepIndex}) => {
        this.setState(updateStateKeys({currentStepIndex}))
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

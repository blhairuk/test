import * as React from "react"

import ChooseAddOns from "./components/choose-add-ons"
import ChooseFrequencySize from "./components/choose-frequency-size"
import ChooseProducts from "./components/choose-products"
import Confirm from "./components/confirm"
import EnterEmail from "./components/enter-email"
import EnterName from "./components/enter-name"

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
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedProductIds: number[],
  selectedVariantIds: number[],
  selectedSize: number,
}

const initialState = {
  bundleName: "",
  currentStepIndex: 0,
  editingBundleId: null,
  enteredEmail: "",
  enteredName: "",
  isBundleFullModalOpen: false,
  isSubmitting: false,
  selectedAddOnIds: [],
  selectedFrequency: null,
  selectedProductIds: [],
  selectedSize: null,
  selectedVariantIds: [],
}

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
      currentStepIndex,
      editingBundleId,
      enteredEmail,
      enteredName,
      isBundleFullModalOpen,
      isSubmitting,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
    } = this.state

    const shippingFrequencies = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_frequency",
    ).split(",")

    const shippingUnitType = getMetafieldValue(
      bundleProductMetafields,
      "subscriptions",
      "shipping_interval_unit_type",
    )

    const filters = JSON.parse(
      getMetafieldValue(
        bundleProductMetafields,
        "bundle_editor",
        "filters",
      ),
    )

    return (
      <AppContainer>
        <div className="bu-slick">
          <div>
            <Step>
              <EnterName
                enterName={this.enterName}
                enteredName={enteredName}
                isActiveStep={currentStepIndex === 0}
                stepNext={this.stepNext}
              />
            </Step>
          </div>
          <div>
            <Step>
              <EnterEmail
                enterEmail={this.enterEmail}
                enteredEmail={enteredEmail}
                enteredName={enteredName}
                isActiveStep={currentStepIndex === 1}
                stepNext={this.stepNext}
                stepPrev={this.stepPrev}
              />
            </Step>
          </div>
          <div>
            <Step>
              <ChooseFrequencySize
                frequencies={shippingFrequencies}
                isActiveStep={currentStepIndex === 2}
                selectedFrequency={selectedFrequency}
                setSelectedFrequency={this.setSelectedFrequency}
                selectedSize={selectedSize}
                setSelectedSize={this.setSelectedSize}
                stepNext={this.stepNext}
                stepPrev={this.stepPrev}
                unitType={shippingUnitType}
                variants={bundleProduct.variants}
              />
            </Step>
          </div>
          <div>
            <Step align="top">
              <ChooseProducts
                addVariantId={this.addVariantId}
                bundleAddOns={bundleAddOns}
                bundleProductMetafields={bundleProductMetafields}
                bundleProducts={bundleProducts}
                filters={filters}
                isActiveStep={currentStepIndex === 3}
                selectedProductIds={selectedProductIds}
                selectedSize={selectedSize}
                removeVariantId={this.removeVariantId}
                selectedVariantIds={selectedVariantIds}
                stepNext={this.stepNext}
                stepPrev={this.stepPrev}
              />
            </Step>
          </div>
          <div>
            <Step align="top">
              <ChooseAddOns
                addAddOnId={this.addAddOnId}
                bundleAddOns={bundleAddOns}
                isActiveStep={currentStepIndex === 4}
                removeAddOnId={this.removeAddOnId}
                selectedAddOnIds={selectedAddOnIds}
                stepNext={this.stepNext}
                stepPrev={this.stepPrev}
              />
            </Step>
          </div>
          <div>
            <Step>
              <Confirm
                bundleAddOns={bundleAddOns}
                bundleProducts={bundleProducts}
                enteredName={enteredName}
                isActiveStep={currentStepIndex === 5}
                isEditingBundle={!!editingBundleId}
                isSubmitting={isSubmitting}
                selectedAddOnIds={selectedAddOnIds}
                selectedFrequency={selectedFrequency}
                selectedProductIds={selectedProductIds}
                selectedSize={selectedSize}
                selectedVariantIds={selectedVariantIds}
                stepPrev={this.stepPrev}
                submit={this.submit}
              />
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

  private setSelectedFrequency = (selectedFrequency) => {
    this.setState(updateStateKeys({selectedFrequency}))
  }

  private setSelectedSize = (selectedSize) => {
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
      this.slickRef = $(".bu-slick").slick({
        accessibility: false,
        adaptiveHeight: true,
        arrows: false,
        draggable: false,
        infinite: false,
        swipe: false,
        touchMove: false,
      })

      this.slickRef.on("afterChange", () => {
        const currentStepIndex = this.slickRef.slick("slickCurrentSlide")
        this.setState(updateStateKeys({currentStepIndex}))
      })
    })
  }
}

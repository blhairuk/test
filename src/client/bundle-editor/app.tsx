import * as React from "react"
import Slider from "react-slick"

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
  bundleProductMetafields: [{
    key: string,
    namespace: string,
    value: string,
  }],
  bundleProduct: ShopifyProduct,
  bundleProducts: ShopifyProduct[],
  customerHash: string,
  subscriptions: RechargeSubscription[],
}

interface State {
  bundleName: string,
  editingBundleId: number,
  enteredEmail: string,
  enteredName: string,
  isBundleFullModalOpen: boolean,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedVariantIds: number[],
  selectedSize: number,
}

const initialState = {
  bundleName: "",
  editingBundleId: null,
  enteredEmail: "",
  enteredName: "",
  isBundleFullModalOpen: false,
  isSubmitting: false,
  selectedAddOnIds: [],
  selectedFrequency: null,
  selectedSize: null,
  selectedVariantIds: [],
}

export default class App extends React.Component<Props, State> {
  public sliderRef: React.RefObject<Slider>
  public state = initialState

  constructor(props) {
    super(props)

    this.sliderRef = React.createRef()

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
  }

  public render() {
    const {
      bundleAddOns,
      bundleProduct,
      bundleProducts,
    } = this.props

    const {
      editingBundleId,
      enteredEmail,
      enteredName,
      isBundleFullModalOpen,
      isSubmitting,
      selectedAddOnIds,
      selectedFrequency,
      selectedVariantIds,
      selectedSize,
    } = this.state

    const shippingFrequencies = this.metafieldValue("subscriptions", "shipping_interval_frequency").split(",")
    const shippingUnitType = this.metafieldValue("subscriptions", "shipping_interval_unit_type")
    const filters = JSON.parse(this.metafieldValue("bundle_editor", "filters"))

    return (
      <AppContainer>
        <Slider
          beforeChange={this.handleSlideChange}
          adaptiveHeight={true}
          arrows={null}
          draggable={false}
          infinite={false}
          ref={this.sliderRef}
        >
          <div>
            <Step>
              <EnterName
                enterName={this.enterName}
                enteredName={enteredName}
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
                stepNext={this.stepNext}
                stepPrev={this.stepPrev}
              />
            </Step>
          </div>
          <div>
            <Step>
              <ChooseFrequencySize
                frequencies={shippingFrequencies}
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
            <Step>
              <ChooseProducts
                addVariantId={this.addVariantId}
                filters={filters}
                products={bundleProducts}
                selectedSize={selectedSize}
                removeVariantId={this.removeVariantId}
                selectedVariantIds={selectedVariantIds}
                stepNext={this.stepNext}
                stepPrev={this.stepPrev}
              />
            </Step>
          </div>
          <div>
            <Step>
              <ChooseAddOns
                addAddOnId={this.addAddOnId}
                products={bundleAddOns}
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
                enteredName={enteredName}
                isEditingBundle={!!editingBundleId}
                isSubmitting={isSubmitting}
                products={bundleProducts.concat(bundleAddOns)}
                selectedAddOnIds={selectedAddOnIds}
                selectedFrequency={selectedFrequency}
                selectedSize={selectedSize}
                selectedVariantIds={selectedVariantIds}
                stepPrev={this.stepPrev}
                submit={this.submit}
              />
            </Step>
          </div>
        </Slider>

        <Modal
          handleClose={this.handleBundleFullModalClose}
          isOpen={isBundleFullModalOpen}
        >
          Your bundle is full!
        </Modal>
      </AppContainer>
    )
  }

  private metafieldValue = (namespace, key) => (
    this.props.bundleProductMetafields.find((mf) => (
      key === mf.key && namespace === mf.namespace
    )).value
  )

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

  private addVariantId = (id) => {
    const {
      selectedVariantIds: oldIds,
      selectedSize,
    } = this.state

    if (!selectedSize) { return alert("You must selected a size first.") }
    if (oldIds.length >= selectedSize) { return this.setState(updateStateKeys({isBundleFullModalOpen: true})) }

    const selectedVariantIds = oldIds.concat(id)

    this.setState(updateStateKeys({selectedVariantIds}))
  }

  private removeVariantId = (id) => {
    const {selectedVariantIds: oldIds} = this.state

    const existingIndex = oldIds.indexOf(id)
    if (existingIndex <= -1) { return }

    const selectedVariantIds = oldIds.filter((_, i) => i !== existingIndex)

    this.setState(updateStateKeys({selectedVariantIds}))
  }

  private addAddOnId = (id) => {
    const {
      selectedAddOnIds: oldIds,
      selectedSize,
    } = this.state

    if (!selectedSize) { return alert("You must select a size first.") }

    const selectedAddOnIds = oldIds.concat([...Array(selectedSize)].map(() => id))

    this.setState(updateStateKeys({selectedAddOnIds}))
  }

  private removeAddOnId = (id) => {
    const {
      selectedAddOnIds: oldIds,
      selectedSize,
    } = this.state

    const selectedAddOnIds = oldIds.slice(0)

    for (let i = 0; i < (selectedSize || 1); ++i) {
      const index = selectedAddOnIds.indexOf(id)
      if (index <= -1) { return }
      selectedAddOnIds.splice(index, 1)
    }

    this.setState(updateStateKeys({selectedAddOnIds}))
  }

  private addToCart = (bundleId, extraData) => {
    return addToCart({
      ...extraData,
      properties: {
        bundle_id: bundleId,
        shipping_interval_frequency: this.state.selectedFrequency,
        shipping_interval_unit_type: this.metafieldValue("subscriptions", "shipping_interval_unit_type"),
        subscription_id: this.metafieldValue("subscriptions", "subscription_id"),
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
      selectedSize,
      selectedVariantIds,
    }
  }

  private stepNext = (e?: React.FormEvent<HTMLElement>) => {
    if (e) { e.preventDefault() }
    this.sliderRef.current.slickNext()
  }

  private stepPrev = (e?: React.FormEvent<HTMLElement>) => {
    if (e) { e.preventDefault() }
    this.sliderRef.current.slickPrev()
  }

  private handleBundleFullModalClose = () => {
    this.setState(updateStateKeys({isBundleFullModalOpen: false}))
  }

  private handleSlideChange = () => {
    $("html, body").animate({scrollTop: 0}, 500)
  }

  private createBundleName = (customerName) => `${customerName}'s box`
}

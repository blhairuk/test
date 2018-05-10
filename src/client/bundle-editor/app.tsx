import * as React from 'react'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

import ChooseAddOns from './components/choose-add-ons'
import ChooseFrequency from './components/choose-frequency'
import ChooseProducts from './components/choose-products'
import ChooseSize from './components/choose-size'
import Controls from './components/controls'
import EnterEmail from './components/enter-email'
import EnterName from './components/enter-name'

import Modal from '../helpers/modal'

import {
  createBundleId,
  createIdQuantities,
} from '../../shared/helpers'
import updateStateKeys from '../update-state-keys'

import {
  addToCart,
  fetchCart,
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from '../cart'

import {BUNDLE_TYPE} from '../../shared/constants'

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleId: number,
  bundleProductMetafields: [{
    key: string,
    value: string,
  }],
  bundleProduct: ShopifyProduct,
  bundleProducts: ShopifyProduct[],
  customerHash: string,
  subscriptions: RechargeSubscription[],
}

enum Steps {
  Name, Email, Frequency, Size, Products, AddOns, Confirm
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
  step: Steps
}

const initialState = {
  bundleName: '',
  editingBundleId: null,
  enteredEmail: '',
  enteredName: '',
  isBundleFullModalOpen: false,
  isSubmitting: false,
  selectedAddOnIds: [],    
  selectedFrequency: null,
  selectedVariantIds: [],
  selectedSize: null,
  step: Steps.Name,
}

export default class App extends React.Component<Props, State> {
  public state = initialState

  constructor (props) {
    super(props)
    
    if (props.subscriptions) {
      const cartState = this.extractStateFromSubscriptions()
      this.state = updateStateKeys(cartState)(initialState)
    }
  }

  async componentDidMount () {
    const {
      bundleId,
      customerHash,
    } = this.props

    if (bundleId && !customerHash) {
      const cartState = await this.extractStateFromCart(bundleId)
      this.setState(updateStateKeys(cartState))
    }
  }

  render () {
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
      step,
    } = this.state

    const shippingFrequencies = this.metafieldValue('shipping_interval_frequency').split(',')
    const shippingUnitType = this.metafieldValue('shipping_interval_unit_type')

    return (
      <div>
        <TransitionGroup>
          <CSSTransition 
            classNames='fade'
            key={step} 
            timeout={1000}
          >
            {(() => {
              switch (step) {
                case Steps.Name:
                  return (
                    <EnterName 
                      enterName={this.enterName}
                      enteredName={enteredName}
                      stepNext={this.stepNext}
                    />
                  )
                case Steps.Email:
                  return (
                    <EnterEmail 
                      enterEmail={this.enterEmail}
                      enteredEmail={enteredEmail} 
                    />
                  )
                case Steps.Frequency:
                  return (
                    <ChooseFrequency
                      frequencies={shippingFrequencies}
                      selectedFrequency={selectedFrequency}
                      setSelectedFrequency={this.setSelectedFrequency}
                      unitType={shippingUnitType}
                    />
                  )
                case Steps.Size:
                  return (
                    <ChooseSize 
                      variants={bundleProduct.variants} 
                      selectedSize={selectedSize}
                      setSelectedSize={this.setSelectedSize}
                    />
                  )
                case Steps.Products:
                  return (
                    <ChooseProducts 
                      addVariantId={this.addVariantId}
                      products={bundleProducts} 
                      removeVariantId={this.removeVariantId}
                      selectedVariantIds={selectedVariantIds}
                    />
                  )
                case Steps.AddOns:
                  return (
                    <ChooseAddOns 
                      addAddOnId={this.addAddOnId}
                      products={bundleAddOns}
                      removeAddOnId={this.removeAddOnId}
                      selectedAddOnIds={selectedAddOnIds}
                    />
                  )
                case Steps.Confirm:
                  return (
                    <Controls
                      enteredName={enteredName}
                      isEditingBundle={!!editingBundleId}
                      isSubmitting={isSubmitting}
                      selectedAddOnIds={selectedAddOnIds}
                      selectedFrequency={selectedFrequency}
                      selectedSize={selectedSize}
                      selectedVariantIds={selectedVariantIds} 
                      submit={this.submit} 
                    />
                  )
              }
            })()}
          </CSSTransition>
        </TransitionGroup>

        <div>
          <a onClick={this.stepPrev}>Prev</a> | <a onClick={this.stepNext}>Next</a>
        </div>

        <Modal 
          handleClose={this.handleBundleFullModalClose}
          isOpen={isBundleFullModalOpen}
        >
          Your bundle is full!
        </Modal>
      </div>
    )
  }

  private metafieldValue = key => this.props.bundleProductMetafields.find(m => m.key === key).value

  private enterEmail = ({target: {value: enteredEmail}}) => {
    this.setState(updateStateKeys({enteredEmail}))
  }

  private enterName = ({target: {value: enteredName}}) => {
    this.setState(updateStateKeys({
      bundleName: enteredName ? `${enteredName}'s box` : '',
      enteredName,
    }))
  }

  private setSelectedFrequency = selectedFrequency => {
    this.setState(updateStateKeys({selectedFrequency}))
  }

  private setSelectedSize = selectedSize => {
    this.setState(updateStateKeys({selectedSize}))
  }

  private addVariantId = id => {
    const {
      selectedVariantIds: oldIds,
      selectedSize,
    } = this.state

    if (!selectedSize) return alert('You must selected a size first.')
    if (oldIds.length >= selectedSize) return this.setState(updateStateKeys({isBundleFullModalOpen: true}))

    const selectedVariantIds = oldIds.concat(id)

    this.setState(updateStateKeys({selectedVariantIds}))
  }

  private removeVariantId = id => {
    const {selectedVariantIds: oldIds} = this.state

    const existingIndex = oldIds.indexOf(id)
    if (existingIndex <= -1) return

    const selectedVariantIds = oldIds.filter((_, i) => i !== existingIndex)

    this.setState(updateStateKeys({selectedVariantIds}))
  }

  private addAddOnId = id => {
    const {
      selectedAddOnIds: oldIds,
      selectedSize,
    } = this.state

    if (!selectedSize) return alert('You must select a size first.')

    const selectedAddOnIds = oldIds.concat([...Array(selectedSize)].map(() => id))

    this.setState(updateStateKeys({selectedAddOnIds}))
  }

  private removeAddOnId = id => {
    const {
      selectedAddOnIds: oldIds,
      selectedSize,
    } = this.state

    const selectedAddOnIds = oldIds.slice(0)

    for (let i = 0; i < (selectedSize || 1); ++i) {
      const index = selectedAddOnIds.indexOf(id)
      if (index <= -1) return
      selectedAddOnIds.splice(index, 1)
    }

    this.setState(updateStateKeys({selectedAddOnIds}))
  }

  private addToCart = (bundleId, extraData) => {
    return addToCart({
      ...extraData,
      properties: {
        bundle_id: bundleId,
        subscription_id: this.metafieldValue('subscription_id'),
        shipping_interval_frequency: this.state.selectedFrequency,
        shipping_interval_unit_type: this.metafieldValue('shipping_interval_unit_type'),
        ...extraData.properties
      }
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
      selectedAddOnIds,
      selectedFrequency,
      selectedSize,
      selectedVariantIds,
    } = this.state

    const data = {
      add_on_ids: selectedAddOnIds,
      frequency: selectedFrequency,
      size: selectedSize,
      variant_ids: selectedVariantIds,
    }

    await $.ajax({
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      method: 'PUT',
      url: window.location.pathname,
    })
  }

  private submitCartBundleUpdates = async () => {
    const {bundleProduct} = this.props

    const {
      bundleName,
      editingBundleId,
      enteredName,
      selectedAddOnIds,
      selectedSize,
      selectedVariantIds,
    } = this.state

    if (editingBundleId) {
      await removeBundleIdFromCart(editingBundleId)
    }

    const sizeVariantId = bundleProduct.variants
      .find(v => parseInt(v.option1) === selectedSize)
      .id
    const bundleId = editingBundleId || createBundleId()
    const idQuantities = createIdQuantities(selectedVariantIds.concat(selectedAddOnIds))

    await this.addToCart(bundleId, {
      id: sizeVariantId,
      properties: {
        bundle_customer_name: enteredName,
        bundle_name: bundleName,
      },
      quantity: 1,
    })

    for (let id in idQuantities) {
      await this.addToCart(bundleId, {
        id,
        quantity: idQuantities[id],
      })
    }

    updateCartDrawerUI()

    this.setState(updateStateKeys({editingBundleId: bundleId}))
  }
  
  private extractStateFromCart = async bundleId => {
    const {
      bundleAddOns,
      bundleProducts,
    } = this.props

    const cart = await fetchCart()

    let bundleName = ''
    let enteredName = ''
    let selectedAddOnIds = []
    let selectedFrequency = null
    let selectedSize = null
    let selectedVariantIds = []

    for (const item of cart.items) {
      const {
        properties: {
          bundle_customer_name,
          bundle_id: itemBundleId,
          bundle_name,
          shipping_interval_frequency: frequency,
        },
        product_id,
        product_type: productType,
        quantity,
        variant_id: variantId,
        variant_options: [size]
      } = item

      if (itemBundleId === bundleId) {
        if (productType === BUNDLE_TYPE) {
          bundleName = bundle_name
          enteredName = bundle_customer_name
          selectedSize = parseInt(size)
          selectedFrequency = frequency
        } else {
          const selectedArray = (() => {
            if (bundleAddOns.some(p => p.id === product_id)) return selectedAddOnIds
            if (bundleProducts.some(p => p.id === product_id)) return selectedVariantIds
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
      enteredName,
      selectedAddOnIds,    
      selectedFrequency,
      selectedVariantIds,
      selectedSize,
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

    let selectedAddOnIds = []
    let selectedFrequency = null
    let selectedSize = null
    let selectedVariantIds = []

    for (const {
      order_interval_frequency,
      quantity,
      shopify_product_id,
      shopify_variant_id,
    } of subscriptions) {
      if (shopify_product_id == bundleProduct.id) {
        selectedFrequency = parseInt(order_interval_frequency)
        selectedSize = parseInt(bundleProduct.variants.find(v => v.id === shopify_variant_id).option1)
      } else {
        const selectedArray = (() => {
          if (bundleAddOns.some(p => p.id === shopify_product_id)) return selectedAddOnIds
          if (bundleProducts.some(p => p.id === shopify_product_id)) return selectedVariantIds
        })()
        if (selectedArray) {
          for (let i = 0; i < quantity; ++i) {
            selectedArray.push(shopify_variant_id)
          }
        }
      }
    }

    return {
      editingBundleId: bundleId,
      selectedAddOnIds,    
      selectedFrequency,
      selectedVariantIds,
      selectedSize,
    }
  }

  private stepNext = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    this.setState(updateStateKeys({step: Steps[Steps[this.state.step]] + 1}))
  }

  private stepPrev = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    this.setState(updateStateKeys({step: Steps[Steps[this.state.step]] - 1}))
  }

  private handleBundleFullModalClose = () => this.setState(updateStateKeys({isBundleFullModalOpen: false}))
}
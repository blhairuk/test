import * as React from 'react'

import ChooseAddOns from './components/choose-add-ons'
import ChooseFrequency from './components/choose-frequency'
import ChooseProducts from './components/choose-products'
import ChooseSize from './components/choose-size'
import Controls from './components/controls'
import Hero from './components/hero'

import updateStateKeys from '../../update-state-keys'

import {
  addToCart,
  fetchCart,
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from '../cart'

import {
  BUNDLE_ADD_ON_TAG,
  BUNDLE_PRODUCT_TAG,
  BUNDLE_TYPE,
} from '../../shop'

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleProductMetafields: [{
    key: string,
    value: string,
  }],
  bundleProduct: ShopifyProduct,
  bundleProducts: ShopifyProduct[],
  customerHash: string,
  query: {
    bid?: string,
  },
  subscriptions: RechargeSubscription[],
}

interface State {
  editingBundleId: number,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedVariantIds: number[],
  selectedSize: number,
}

const initialState = {
  editingBundleId: null,
  isSubmitting: false,
  selectedAddOnIds: [],    
  selectedFrequency: null,
  selectedVariantIds: [],
  selectedSize: null,
}

export default class App extends React.Component<Props, State> {
  public state = initialState

  constructor (props) {
    super(props)
    
    if (props.subscriptions) {
      const cartState = this.extractStateFromSubscriptions()
      this.state = updateStateKeys(cartState)(initialState, props)
    }
  }

  async componentDidMount () {
    const {bid: bundleId} = this.props.query

    if (bundleId) {
      const cartState = await this.extractStateFromCart(parseInt(bundleId))
      this.setState(updateStateKeys(cartState))
    }
  }

  render () {
    const {
      bundleAddOns,
      bundleProduct,
      bundleProducts,
      bundleProductMetafields,
    } = this.props

    const {
      editingBundleId,
      isSubmitting,
      selectedAddOnIds,
      selectedFrequency,
      selectedVariantIds,
      selectedSize,
    } = this.state

    const shippingFrequencies = this.metafieldValue('shipping_interval_frequency').split(',')
    const shippingUnitType = this.metafieldValue('shipping_interval_unit_type')

    return (
      <div>
        <Hero product={bundleProduct} />
        <ChooseSize 
          variants={bundleProduct.variants} 
          selectedSize={selectedSize}
          setSelectedSize={this.setSelectedSize}
        />
        <ChooseFrequency
          frequencies={shippingFrequencies}
          selectedFrequency={selectedFrequency}
          setSelectedFrequency={this.setSelectedFrequency}
          unitType={shippingUnitType}
        />
        <ChooseProducts 
          addVariantId={this.addVariantId}
          products={bundleProducts} 
          removeVariantId={this.removeVariantId}
          selectedVariantIds={selectedVariantIds}
        />
        <ChooseAddOns 
          addAddOnId={this.addAddOnId}
          products={bundleAddOns}
          removeAddOnId={this.removeAddOnId}
          selectedAddOnIds={selectedAddOnIds}
        />
        <Controls
          isEditingBundle={!!editingBundleId}
          isSubmitting={isSubmitting}
          selectedAddOnIds={selectedAddOnIds}
          selectedFrequency={selectedFrequency}
          selectedSize={selectedSize}
          selectedVariantIds={selectedVariantIds} 
          submit={this.submit} 
        />
      </div>
    )
  }

  private metafieldValue = key => this.props.bundleProductMetafields.find(m => m.key === key).value

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
    if (oldIds.length >= selectedSize) return alert('You must remove other products first.')

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

  private addToCart = extraData => {
    return addToCart({
      ...extraData,
      properties: {
        subscription_id: this.metafieldValue('subscription_id'),
        shipping_interval_frequency: this.state.selectedFrequency,
        shipping_interval_unit_type: this.metafieldValue('shipping_interval_unit_type'),
        ...extraData.properties
      }
    })
  }

  private submit = async () => {
    this.setState(updateStateKeys({
      isSubmitting: true,
    }))

    const {
      bundleProduct,
    } = this.props

    const {
      editingBundleId,
      selectedAddOnIds,
      selectedSize,
      selectedVariantIds,
    } = this.state

    const sizeVariantId = bundleProduct.variants
      .find(v => parseInt(v.option1) === selectedSize)
      .id
    const bundleId = editingBundleId || (new Date()).getTime()
    const idQuantities = selectedVariantIds
      .concat(selectedAddOnIds)
      .reduce((obj, id) => {
        obj[id] = (obj[id] || 0) + 1
        return obj
      }, {})

    if (editingBundleId) {
      await removeBundleIdFromCart(editingBundleId)
    }

    await this.addToCart({
      id: sizeVariantId,
      properties: {
        bundle_id: bundleId,
      },
      quantity: 1,
    })

    for (let id in idQuantities) {
      await this.addToCart({
        id,
        properties: {
          bundle_id: bundleId,
          bundle_is_add_on: selectedAddOnIds.includes(parseInt(id)) || undefined,
        },
        quantity: idQuantities[id],
      })
    }

    this.setState(updateStateKeys({
      editingBundleId: bundleId,
      isSubmitting: false,
    }))

    updateCartDrawerUI()
  }
  
  private extractStateFromCart = async bundleId => {
    const cart = await fetchCart()

    let selectedAddOnIds = []
    let selectedFrequency = null
    let selectedSize = null
    let selectedVariantIds = []

    for (const item of cart.items) {
      const {
        properties: {
          bundle_id: itemBundleId,
          bundle_is_add_on,
          shipping_interval_frequency: frequency,
        },
        product_type: productType,
        quantity,
        variant_id: variantId,
        variant_options: [size]
      } = item

      if (itemBundleId === bundleId) {
        if (productType === BUNDLE_TYPE) {
          selectedSize = parseInt(size)
          selectedFrequency = frequency
        } else {
          for (let i = 0; i < quantity; ++i) {
            if (bundle_is_add_on) selectedAddOnIds.push(variantId)
            else selectedVariantIds.push(variantId) 
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

  private extractStateFromSubscriptions = () => {
    const {
      bundleAddOns,
      bundleProduct,
      bundleProducts,
      subscriptions,
    } = this.props

    let selectedAddOnIds = []
    let selectedFrequency = null
    let selectedSize = null
    let selectedVariantIds = []

    for (const {
      properties,
      quantity,
      shopify_product_id,
      shopify_variant_id,
    } of subscriptions) {
      if (shopify_product_id == bundleProduct.id) {
        selectedFrequency = parseInt(properties.find(p => p.name === 'shipping_interval_frequency').value)
        selectedSize = parseInt(bundleProduct.variants.find(v => v.id === shopify_variant_id).option1)
      } else {
        const selectedArray = (() => {
          if (bundleAddOns.some(p => p.id === shopify_product_id)) {
            return selectedAddOnIds
          } else if (bundleProducts.some(p => p.id === shopify_product_id)) {
            return selectedVariantIds
          }
        })()

        if (selectedArray) {
          for (let i = 0; i < quantity; ++i) {
            selectedArray.push(shopify_variant_id)
          }
        }
      }
    }

    return {
      selectedAddOnIds,    
      selectedFrequency,
      selectedVariantIds,
      selectedSize,
    }
  }

  private createBundleCompositionString = () => {
    const {bundleProducts} = this.props
    const {selectedVariantIds} = this.state

    const parts = []

    const variantIdNums = {}
    for (const id of selectedVariantIds) {
      if (!variantIdNums[id]) {
        variantIdNums[id] = 0
      }
      ++variantIdNums[id]
    }

    for (const id in variantIdNums) {
      const product = bundleProducts.find(p => 
        p.variants.find(v => v.id === parseInt(id)
      ) ? true : false)
      parts.push(`${variantIdNums[id]} x ${product.title}`)
    }

    return parts.join(',')
  }
}
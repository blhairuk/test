import * as React from 'react'

import ChooseAddOns from './components/choose-add-ons'
import ChooseFrequency from './components/choose-frequency'
import ChooseProducts from './components/choose-products'
import ChooseSize from './components/choose-size'
import Controls from './components/controls'
import Hero from './components/hero'

import {
  addToCart,
  fetchCart,
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from '../cart'

interface Props {
  collection: ShopifyCollection,
  product: {
    variants: ShopifyVariant[]
  },
  productMetafields: [{
    key: string,
    value: string,
  }],
  products: ShopifyProduct[],
  query: {
    bid?: string,
  },
}

interface State {
  editingBundleId: number,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedVariantIds: number[],
  selectedSize: number,
}

const BUNDLE_ADD_ON_TYPE = 'Bundle Add-On'
const BUNDLE_PRODUCT_TYPE = 'Bundle Product'

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

  async componentDidMount () {
    const {bid: bundleId} = this.props.query

    if (bundleId) {
      this.setState({
        ...this.state,
        ...(await this.extractStateFromCart(parseInt(bundleId)))
      })
    }
  }

  render () {
    const {
      collection,
      product,
      products,
      productMetafields,
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
    const bundleProducts = products.filter(p => p.product_type === BUNDLE_PRODUCT_TYPE)
    const bundleAddOns = products.filter(p => p.product_type === BUNDLE_ADD_ON_TYPE)

    return (
      <div>
        <Hero collection={collection} />
        <ChooseSize 
          variants={product.variants} 
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

  private metafieldValue = key => this.props.productMetafields.find(m => m.key === key).value

  private setSelectedFrequency = selectedFrequency => {
    this.setState({
      ...this.state, 
      selectedFrequency
    })
  }

  private setSelectedSize = selectedSize => {
    this.setState({
      ...this.state, 
      selectedSize
    })
  }

  private addVariantId = id => {
    const {
      selectedVariantIds: oldIds,
      selectedSize,
    } = this.state

    if (!selectedSize) return alert('You must selected a size first.')
    if (oldIds.length >= selectedSize) return alert('You must remove other products first.')

    const selectedVariantIds = oldIds.concat(id)

    this.setState({
      ...this.state, 
      selectedVariantIds,
    })
  }

  private removeVariantId = id => {
    const {selectedVariantIds: oldIds} = this.state

    const existingIndex = oldIds.indexOf(id)
    if (existingIndex <= -1) return

    const selectedVariantIds = oldIds.filter((_, i) => i !== existingIndex)

    this.setState({
      ...this.state,
      selectedVariantIds,
    })
  }

  private addAddOnId = id => {
    const {
      selectedAddOnIds: oldIds,
      selectedSize,
    } = this.state

    if (!selectedSize) return alert('You must select a size first.')

    const selectedAddOnIds = oldIds.concat([...Array(selectedSize)].map(() => id))

    this.setState({
      ...this.state,
      selectedAddOnIds,
    })
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

    this.setState({
      ...this.state,
      selectedAddOnIds
    })
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
    this.setState({...this.state, isSubmitting: true})

    const {
      product: bundle,
      products,
    } = this.props

    const {
      editingBundleId,
      selectedAddOnIds,
      selectedSize,
      selectedVariantIds,
    } = this.state

    const sizeVariantId = bundle.variants
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
      properties: {bundle_id: bundleId},
      quantity: 1,
    })

    for (let id in idQuantities) {
      await this.addToCart({
        id,
        properties: {
          is_add_on: selectedAddOnIds.indexOf(parseInt(id)) > -1 ? true : undefined,
          parent_bundle_id: bundleId
        },
        quantity: idQuantities[id],
      })
    }

    this.setState({
      ...this.state,
      editingBundleId: bundleId,
      isSubmitting: false
    })

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
          is_add_on: isAddOn,
          parent_bundle_id: itemParentBundleId,
          shipping_interval_frequency: frequency,
        },
        quantity,
        variant_id: variantId,
        variant_options: [size]
      } = item

      if (itemBundleId === bundleId) {
        selectedSize = parseInt(size)
        selectedFrequency = frequency
      } else if (itemParentBundleId === bundleId) {
        for (let i = 0; i < quantity; ++i) {
          if (isAddOn) selectedAddOnIds.push(variantId)
          else selectedVariantIds.push(variantId) 
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
}
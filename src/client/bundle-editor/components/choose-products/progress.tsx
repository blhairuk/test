import * as React from "react"

import {createIdQuantities} from "../../../../shared/helpers"

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleProducts: ShopifyProduct[],
  selectedProductIds: number[],
}

export default class Progress extends React.Component<Props> {
  public render() {
    const {
      bundleAddOns,
      bundleProducts,
      selectedProductIds,
    } = this.props

    const allProducts = bundleProducts.concat(bundleAddOns)
    const idQuantities = createIdQuantities(selectedProductIds)

    const renderProduct = ([productIdS, quantity]) => {
      const productId = parseInt(productIdS, 10)
      const product = allProducts.find(({id}) => id === productId)

      return (
        <div key={productId}>
          {quantity}x {product.title}
        </div>
      )
    }

    return (
      <div>
        {Object.entries(idQuantities).map(renderProduct)}
      </div>
    )
  }
}

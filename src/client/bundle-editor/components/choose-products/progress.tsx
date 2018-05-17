import * as React from "react"

import {createIdQuantities} from "../../../../shared/helpers"

interface Props {
  bundleAddOns: ShopifyProduct[],
  bundleName: string,
  bundleProducts: ShopifyProduct[],
  numSelected: number,
  selectedProductIds: number[],
  selectedSize: number,
  updateBundleName: (e) => any,
}

export default class Progress extends React.Component<Props> {
  public render() {
    const {
      bundleAddOns,
      bundleName,
      bundleProducts,
      numSelected,
      selectedProductIds,
      selectedSize,
      updateBundleName,
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
        <div>
          <input
            onChange={updateBundleName}
            type="text"
            value={bundleName}
          />
        </div>
        <div>
          {numSelected} of {selectedSize}
        </div>
        {Object.entries(idQuantities).map(renderProduct)}
      </div>
    )
  }
}

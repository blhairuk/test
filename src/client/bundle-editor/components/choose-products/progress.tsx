import * as React from "react"

import {createIdQuantities} from "../../../../shared/helpers"
import ProgressGradientBar from "../styled/progress-gradient-bar"

interface Props {
  allProducts: ShopifyProduct[],
  bundleName: string,
  selectedProductIds: number[],
  selectedSize: number,
  selectedVariantIds: number[],
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
}

export default class Progress extends React.Component<Props> {
  public render() {
    const {
      allProducts,
      bundleName,
      selectedProductIds,
      selectedVariantIds,
      selectedSize,
      updateBundleName,
    } = this.props

    const numSelected = selectedVariantIds.length
    const idQuantities = createIdQuantities(selectedProductIds)

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

        <ProgressGradientBar width={(numSelected / selectedSize) || 0} />

        {Object.entries(idQuantities).map(([productIdS, quantity]) => {
          const productId = parseInt(productIdS, 10)
          const product = allProducts.find(({id}) => id === productId)

          return (
            <div key={productId}>
              {quantity}x {product.title}
            </div>
          )
        })}
      </div>
    )
  }
}

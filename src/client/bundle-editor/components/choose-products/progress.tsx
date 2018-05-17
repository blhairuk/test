import * as React from "react"

import {createIdQuantities} from "../../../../shared/helpers"
import {Context as AppContext} from "../../app"
import ProgressGradientBar from "../styled/progress-gradient-bar"

export default class Progress extends React.Component<{}> {
  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    bundleAddOns,
    bundleName,
    bundleProducts,
    selectedProductIds,
    selectedVariantIds,
    selectedSize,
    updateBundleName,
  }) => {
    const numSelected = selectedVariantIds.length
    const allProducts = bundleProducts.concat(bundleAddOns)
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

import * as React from "react"
import styled from "styled-components"

import {
  createIdQuantities,
  findProductByVariantId,
} from "../../../../shared/helpers"

import ProgressGradientBar from "../styled/progress-gradient-bar"

interface Props {
  bundleName: string,
  bundleProducts: ShopifyProduct[],
  removeVariantId: (productId: number, variantId: number, quantity?: number) => () => any,
  selectedProductIds: number[],
  selectedSize: number,
  selectedVariantIds: number[],
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
}

export default class Progress extends React.Component<Props> {
  public render() {
    const {
      bundleName,
      bundleProducts,
      removeVariantId,
      selectedVariantIds,
      selectedSize,
      updateBundleName,
    } = this.props

    const numSelected = selectedVariantIds.length
    const idQuantities = createIdQuantities(selectedVariantIds)

    return (
      <Wrapper>
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

        {Object.entries(idQuantities).map(([variantIdS, quantity]: [string, number]) => {
          const variantId = parseInt(variantIdS, 10)
          const product = findProductByVariantId(bundleProducts, variantId)

          // product will not found for add-on items
          if (!product) { return null }

          const {
            id: productId,
            image: {src},
            title,
          } = product

          return (
            <div
              className="grid grid--uniform grid--no-gutters"
              key={productId}
            >
              <div className="grid__item one-quarter">
                <img src={src} />
              </div>

              <div className="grid__item one-half">
                <small>{quantity}x {title}</small>
              </div>

              <div className="grid__item one-quarter text-right">
                <a onClick={removeVariantId(productId, variantId, quantity)}>REM</a>
              </div>
            </div>
          )
        })}
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  background-color: #000;
  border-radius: 10px;
`

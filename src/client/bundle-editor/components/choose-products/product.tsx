import * as React from "react"
import styled from "styled-components"

import {productTitleWithoutType} from "../../../../shared/helpers"
import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"

interface Props {
  addVariant: (variant: ShopifyVariant, product: ShopifyProduct) => () => any,
  isAddOn: boolean,
  openProductDetailsModal: (productId: number) => any,
  product: ShopifyProduct,
  removeAddOnId: (productId: number, variantId: number, quantity?: number) => () => any,
  removeVariantId: (productId: number, variantId: number, quantity?: number) => () => any,
  selectedIds: number[],
}

export default class Product extends React.Component<Props> {
  public render() {
    const {
      addVariant,
      isAddOn,
      openProductDetailsModal,
      product,
      removeAddOnId,
      removeVariantId,
      selectedIds,
    } = this.props

    const {
      id: productId,
      image: {src},
      product_type,
      title,
      variants,
    } = product

    const variant = variants[0]

    const {
      id: variantId,
      price,
    } = variant

    const numSelected = selectedIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)
    const removeFunc = isAddOn ? removeAddOnId : removeVariantId

    return (
      <div>
        <Link
          href="javascript:void(0)"
          onClick={openProductDetailsModal(productId)}
        >
          <img src={src} />
          <div style={{margin: "12px 0"}}>
            {productTitleWithoutType(title, product_type)}
          </div>
        </Link>

        <FlexWrapper justifyContent="center">
          {(() => {
            if (numSelected === 0) {
              return (
                <Button
                  onClick={addVariant(variant, product)}
                  type="button"
                >
                  {(() => {
                    if (price === "0.00") { return "Add" }
                    return `Add +$${price}`
                  })()}
                </Button>
              )
            }

            return (
              <>
                <QuantityWrapper onClick={removeFunc(productId, variantId)}>
                  <QuantityButton>-</QuantityButton>
                </QuantityWrapper>

                <Number>
                  {numSelected}
                </Number>

                <QuantityWrapper onClick={addVariant(variant, product)}>
                  <QuantityButton style={{top: "1px"}}>+</QuantityButton>
                </QuantityWrapper>
              </>
            )
          })()}
        </FlexWrapper>
      </div>
    )
  }
}

const Link = styled.a`
  &:focus {
    box-shadow: none;
    outline-style: none;
  }
`

const Number = styled.div`
  font-size: 220%;
  font-weight: bold;
  line-height: 0.8;
  margin: 0 6px;
  padding: 0 10px;
`

const QuantityButton = styled.span`
  font-size: 24px;
  line-height: 20px;
  position: relative;
`

const QuantityWrapper = styled.a.attrs({
  href: "javascript:void(0)",
})`
  background-color: #000;
  border-radius: 12px;
  color: #fff;
  height: 24px;
  width: 24px;

  &:focus {
    box-shadow: none;
    outline-style: none;
  }
`

import * as React from "react"
import styled from "styled-components"

import {productTitleWithoutType} from "../../../../shared/helpers"
import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"

interface Props {
  addAddOnId: (productId: number, variantId: number) => () => any,
  addVariantId: (productId: number, variantId: number) => () => any,
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
      addAddOnId,
      addVariantId,
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

    const {
      id: variantId,
      price,
    } = variants[0]

    const numSelected = selectedIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)
    const addFunc = isAddOn ? addAddOnId : addVariantId
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
                  onClick={addFunc(productId, variantId)}
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

                <QuantityWrapper onClick={addFunc(productId, variantId)}>
                  <QuantityButton>+</QuantityButton>
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
  font-size: 30px;
  line-height: 20px;
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

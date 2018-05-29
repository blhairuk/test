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
  removeAddOnId: (productId: number, variantId: number) => () => any,
  removeVariantId: (productId: number, variantId: number) => () => any,
  selectedAddOnIds: number[],
  selectedVariantIds: number[],
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
      selectedAddOnIds,
      selectedVariantIds,
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

    const selectedIds = isAddOn ? selectedAddOnIds : selectedVariantIds
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
                <QuantityButton
                  color="black"
                  onClick={removeFunc(productId, variantId)}
                  type="button"
                >
                  -
                </QuantityButton>

                <Number>
                  {numSelected}
                </Number>

                <QuantityButton
                  href="javascript:void(0)"
                  onClick={addFunc(productId, variantId)}
                >
                  +
                </QuantityButton>
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

const QuantityButton = styled.a`
  background-color: #000;
  border-radius: 10px;
  color: #fff;
  font-size: 24px;
  line-height: 24px;
  padding: 0;
  width: 20px;
`

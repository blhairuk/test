import * as React from "react"

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
        <img src={src} />

        <div style={{margin: "12px 0"}}>
          <a onClick={openProductDetailsModal(productId)}>
            {(() => {
              if (price === "0.00") { return title }
              return `${title} (+${price})`
            })()}
          </a>
        </div>

        <FlexWrapper justifyContent="center">
          {(() => {
            if (numSelected === 0) {
              return (
                <Button
                  onClick={addFunc(productId, variantId)}
                  type="button"
                >
                  Add
                </Button>
              )
            }

            return (
              <>
                <Button
                  color="black"
                  onClick={removeFunc(productId, variantId)}
                  type="button"
                >
                  -
                </Button>

                <span
                  style={{
                    fontSize: "250%",
                    fontWeight: "bold",
                    lineHeight: "0.8",
                    padding: "0 10px",
                  }}
                >
                  {numSelected}
                </span>

                <Button
                  color="black"
                  onClick={addFunc(productId, variantId)}
                  type="button"
                >
                  +
                </Button>
              </>
            )
          })()}
        </FlexWrapper>
      </div>
    )
  }
}

import * as React from "react"

import Button from "../styled/button"

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
        <h3 className="h4">
          <a onClick={openProductDetailsModal(productId)}>
            {(() => {
              if (price === "0.00") { return title }
              return `${title} (+${price})`
            })()}
          </a>
        </h3>

        <img src={src} />

        {(() => {
          if (numSelected === 0) {
            return (
              <div>
                <Button
                  onClick={addFunc(productId, variantId)}
                  type="button"
                >
                  Add
                </Button>
              </div>
            )
          }

          return (
            <div>
              <Button
                color="black"
                onClick={removeFunc(productId, variantId)}
                type="button"
              >
                -
              </Button>

              <span style={{fontSize: "150%", fontWeight: "bold"}}>
                {numSelected}
              </span>

              <Button
                color="black"
                onClick={addFunc(productId, variantId)}
                type="button"
              >
                +
              </Button>
            </div>
          )
        })()}
      </div>
    )
  }
}

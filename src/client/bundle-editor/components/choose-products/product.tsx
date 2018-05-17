import * as React from "react"

import {Context as AppContext} from "../../app"
import Button from "../styled/button"

interface Props {
  isAddOn: boolean,
  product?: ShopifyProduct
}

export default class Product extends React.Component<Props> {
  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    addAddOnId,
    addVariantId,
    openProductDetailsModal,
    removeAddOnId,
    removeVariantId,
    selectedAddOnIds,
    selectedVariantIds,
  }) => {
    const {
      isAddOn,
      product,
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

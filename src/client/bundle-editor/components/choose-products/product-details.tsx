import * as React from "react"

interface Props {
  product?: ShopifyProduct
}

export default class ProductDetails extends React.Component<Props> {
  public render() {
    const {product} = this.props

    if (!product) {
      return null
    }

    const {title} = product

    return (
      <div>Product details for {title}</div>
    )
  }
}
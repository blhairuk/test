import * as React from "react"

interface Props {
  closeProductDetailsModal: () => any,
  product: ShopifyProduct
}

export default class ProductDetails extends React.Component<Props> {
  public render() {
    const {
      closeProductDetailsModal,
      product,
    } = this.props

    const {
      body_html,
      image: {src},
      title,
    } = product

    return (
      <div>
        <a onClick={closeProductDetailsModal}>Close</a>
        <h2>{title}</h2>
        <img src={src} />
        <div dangerouslySetInnerHTML={{__html: body_html}} />
      </div>
    )
  }
}

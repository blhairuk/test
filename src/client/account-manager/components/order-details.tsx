import * as React from "react"

export interface Props {
  order: ShopifyOrder,
}

export default class OrderDetails extends React.Component<Props> {
  public render() {
    const {order} = this.props

    return (
      <div>{JSON.stringify(order)}</div>
    )
  }
}

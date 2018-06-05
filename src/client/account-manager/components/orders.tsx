import * as React from "react"

import Order from "./order"

export interface Props {
  orders: ShopifyOrder[],
}

export default class Orders extends React.Component<Props> {
  public render() {
    const {orders} = this.props
    return (
      <div>
        <h3>Orders</h3>
        {orders.map((order) => (
          <Order
            key={order.id}
            order={order}
          />
        ))}
      </div>
    )
  }
}

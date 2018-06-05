import * as React from "react"

import Order from "./order"

export interface Props {
  createHref: (path: string) => any,
  orders: ShopifyOrder[],
}

export default class Orders extends React.Component<Props> {
  public render() {
    const {
      createHref,
      orders,
    } = this.props

    return (
      <div>
        <h3>Orders</h3>
        {orders.map((order) => (
          <Order
            createHref={createHref}
            key={order.id}
            order={order}
          />
        ))}
      </div>
    )
  }
}

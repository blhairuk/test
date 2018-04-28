import * as React from 'react'

export interface Props {
  orders: RechargeOrder[]
}

export default class History extends React.Component<Props> {
  render () {
    const {orders} = this.props

    return (
      <div>
        <h3>Orders</h3>
        <ul>
          {orders.map(({id}) => (
            <li>Order #{id}</li>
          ))}
        </ul>
      </div>
    )
  }
}
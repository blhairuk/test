import * as React from 'react'

export interface Props {
  addresses: RechargeAddress[],
  subscriptions: RechargeSubscription[]
}

export default class SubscriptionRow extends React.Component<Props> {
  render () {
    const {
      subscriptions,
    } = this.props

    return (
      <li>
        <p>
          <strong>Ships to: {this.addressLine()}</strong>
        </p>

        <table className='full table--responsive'>
          <thead>
            <tr>
              <th>Product</th>
              <th>Amount</th>
              <th>USD</th>
              <th>Frequency</th>
              <th>Next charge date</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map(({
              id,
              price,
              product_title,
              next_charge_scheduled_at,
              order_interval_frequency,
              order_interval_unit,
              quantity,
              status,
            }) => (
              <tr key={id}>
                <td>{product_title}</td>
                <td>{quantity}</td>
                <td>{price}</td>
                <td>{`${order_interval_frequency} ${order_interval_unit}`}</td>
                <td>{next_charge_scheduled_at || '-'}</td>
                <td>{this.controls(status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </li>
    )
  }

  private addressLine = () => {
    const {
      address1,
      address2,
      city,
      zip,
    } = this.props.addresses[0]

    return [
      address1,
      address2,
      city,
      zip,
    ]
      .filter(p => !!p)
      .join(', ')
  }

  private controls = status => {
    if (status === 'CANCELLED') {
      return 'Re-activate'
    }
    return 'Edit - Cancel'
  }
}
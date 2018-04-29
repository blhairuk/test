import * as React from 'react'

export interface Props {
  address: RechargeAddress,
  subscription: RechargeSubscription
}

export default class SubscriptionRow extends React.Component<Props> {
  render () {
    const {
      address,
      subscription: {
        id
      },
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
    } = this.props.address

    return [
      address1,
      address2,
      city,
      zip,
    ]
      .filter(p => !!p)
      .join(', ')
  }
}
import * as React from 'react'
import styled from 'styled-components'

import SubscriptionRow from '../components/subscription-row'

export interface Props {
  addresses: RechargeAddress[],
  subscriptions: RechargeSubscription[]
}

const List = styled.ol`
  list-style: none;
  margin: 0;
`

export default class Subscriptions extends React.Component<Props> {
  render () {
    const {
      addresses,
      subscriptions,
    } = this.props

    return (
      <div>
        <h3>Subscription orders</h3>
        <List>
          {subscriptions.map(s => (
            <SubscriptionRow
              address={addresses.find(a => a.id === s.address_id)}
              key={s.id}
              subscription={s}
            />
          ))}
        </List>
      </div>
    )
  }
}
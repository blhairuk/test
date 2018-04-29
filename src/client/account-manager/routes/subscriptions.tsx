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

    const bundleSubscriptions = this.bundleSubscriptions()

    return (
      <div>
        <h3>Subscription orders</h3>
        <List>
          {Object.keys(bundleSubscriptions).map(bundleId => (
            <SubscriptionRow
              addresses={addresses}
              key={bundleId}
              subscriptions={bundleSubscriptions[bundleId]}
            />
          ))}
        </List>
      </div>
    )
  }

  private bundleSubscriptions = () => (
    this.props.subscriptions.reduce((obj, s) => {
      const property = s.properties.find(({name}) => (
        name === 'bundle_id' || name === 'parent_bundle_id' // TODO: remove parent_bundle_id
      ))
      if (property) {
        const {value} = property
        obj[value] = (obj[value] || []).concat(s)
      }
      return obj
    }, {})
  )
}
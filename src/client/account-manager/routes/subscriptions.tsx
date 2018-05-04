import * as React from 'react'
import styled from 'styled-components'

import SubscriptionRow from '../components/subscription-row'
import {getBundleIdFromProperties} from '../../../helpers'

export interface Props {
  addresses: RechargeAddress[],
  href: (string, Object?) => any,
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
      href,
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
              href={href}
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
      const value = getBundleIdFromProperties(s.properties)
      if (value) {
        obj[value] = (obj[value] || []).concat(s)
      }
      return obj
    }, {})
  )
}
import * as React from "react"
import styled from "styled-components"

import {getBundleIdFromProperties} from "../../../shared/helpers"
import SubscriptionRow from "../components/subscription-row"

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
  public render() {
    const {
      addresses,
      href,
    } = this.props

    const bundleSubscriptions = this.bundleSubscriptions()

    return (
      <div>
        <h3>Subscription orders</h3>
        <List>
          {Object.keys(bundleSubscriptions).map((bundleId) => (
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

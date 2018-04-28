import * as React from 'react'

export interface Props {
  subscriptions: RechargeSubscription[]
}

export default class Subscriptions extends React.Component<Props> {
  render () {
    const {subscriptions} = this.props

    return (
      <div>
        <h3>Subscriptions</h3>
        <ul>
          {subscriptions.map(({id}) => (
            <li>Subscription #{id}</li>
          ))}
        </ul>
      </div>
    )
  }
}
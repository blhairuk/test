import * as React from 'react'

interface IProps {
  customer: {
    first_name: string,
  },
  subscriptions: [Object]
}

export default class App extends React.Component<IProps> {
  render () {
    return (
      <div>
        <div>{this.props.customer.first_name}'s subscriptions</div>
      </div>
    )
  }
}
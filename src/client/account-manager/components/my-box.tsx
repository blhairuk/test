import * as React from "react"

import EditBundle from "./edit-bundle"

export interface Props {
  bundles: {string: RechargeSubscription[]},
}

export default class MyBox extends React.Component<Props> {
  public render() {
    const {bundles} = this.props

    const numBundles = Object.keys(bundles).length

    return numBundles === 0 ? (
      <div>no bundles</div>
    ) : (
      <div>
        {Object.entries(bundles).map(([idS, subscriptions]) => (
          <EditBundle
            key={idS}
            subscriptions={subscriptions}
          />
        ))}
      </div>
    )
  }
}

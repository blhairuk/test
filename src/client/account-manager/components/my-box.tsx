import * as React from "react"

import EditBundle from "./edit-bundle"

export interface Props {
  addresses: RechargeAddress[],
  bundles: {idS: RechargeSubscription[]},
  charges: RechargeCharge[],
  createHref: (path: string) => any,
  products: ShopifyProduct[],
}

export default class MyBox extends React.Component<Props> {
  public render() {
    const {
      addresses,
      bundles,
      charges,
      createHref,
      products,
    } = this.props

    const numBundles = Object.keys(bundles).length

    return numBundles === 0 ? (
      <div>no bundles</div>
    ) : (
      <div>
        {Object.entries(bundles).map(([idS, subscriptions]) => (
          <EditBundle
            addresses={addresses}
            charges={charges}
            createHref={createHref}
            key={idS}
            products={products}
            subscriptions={subscriptions}
          />
        ))}
      </div>
    )
  }
}

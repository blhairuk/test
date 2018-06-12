import * as React from "react"

import EditBundle from "./edit-bundle"

export interface Props {
  addresses: RechargeAddress[],
  bundles: HHBundle[],
  charges: RechargeCharge[],
  createHref: (path: string) => any,
  products: ShopifyProduct[],
  openLoadingModal: () => any,
}

export default class MyBox extends React.Component<Props> {
  public render() {
    const {
      addresses,
      bundles,
      charges,
      createHref,
      products,
      openLoadingModal,
    } = this.props

    if (bundles.length === 0) {
      return (
        <div>no bundles</div>
      )
    }

    const numActiveBundles = bundles.reduce((sum, {status}) => sum + (status === "ACTIVE" ? 1 : 0), 0)
    const bundlesToRender = numActiveBundles > 0
      ? bundles.filter(({status}) => status === "ACTIVE")
      : [bundles.find(({status}) => status === "CANCELLED")]

    return (
      <div>
        {bundlesToRender.map(({id, status, subscriptions}) => (
          <EditBundle
            addresses={addresses}
            charges={charges}
            createHref={createHref}
            key={id}
            products={products}
            openLoadingModal={openLoadingModal}
            status={status}
            subscriptions={subscriptions}
          />
        ))}
      </div>
    )
  }
}

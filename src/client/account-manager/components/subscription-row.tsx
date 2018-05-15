import {format as formatDate} from "date-fns"
import * as React from "react"

import {getBundleIdFromProperties} from "../../../shared/helpers"

export interface Props {
  addresses: RechargeAddress[],
  href: (string, Object?) => any,
  subscriptions: RechargeSubscription[]
}

export default class SubscriptionRow extends React.Component<Props> {
  public render() {
    const {
      subscriptions,
    } = this.props

    return (
      <li>
        <p>
          <strong>Ships to: {this.addressLine()}</strong>
        </p>

        <table className="full table--responsive">
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
            {subscriptions.map(({
              id,
              price,
              product_title,
              next_charge_scheduled_at,
              order_interval_frequency,
              order_interval_unit,
              properties,
              quantity,
              status,
            }) => (
              <tr key={id}>
                <td>{product_title}</td>
                <td>{quantity}</td>
                <td>{price}</td>
                <td>{`${order_interval_frequency} ${order_interval_unit}s`}</td>
                <td>{this.nextChargeDate(next_charge_scheduled_at)}</td>
                <td>{this.controls({bundleId: getBundleIdFromProperties(properties), status})}</td>
              </tr>
            ))}
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
    } = this.props.addresses[0]

    return [
      address1,
      address2,
      city,
      zip,
    ]
      .filter((p) => !!p)
      .join(", ")
  }

  private controls = ({bundleId, status}) => {
    const {href} = this.props

    return (
      <div>
        {status === "CANCELLED" ? (
          <a
            href="javascript:void(0)"
            onClick={this.submitReactivate(bundleId)}
          >
            Re-activate
          </a>
        ) : (
          <>
            <a href={href(`/bundles/${bundleId}`)}>Edit</a>
            <span> - </span>
            <a
              href="javascript:void(0)"
              onClick={this.submitCancel(bundleId)}
            >
              Cancel
            </a>
          </>
        )}
      </div>
    )
  }

  private nextChargeDate = (date) => date ? formatDate(date, "dddd, MMMM D") : "-"

  private submitCancel = (bundleId) => async () => {
    const {href} = this.props
    await $.ajax({
      contentType: "application/json",
      dataType: "json",
      method: "DELETE",
      url: href(`/bundles/${bundleId}`),
    })
    window.location.reload()
  }

  private submitReactivate = (bundleId) => async () => {
    const {href} = this.props
    await $.ajax({
      contentType: "application/json",
      dataType: "json",
      method: "POST",
      url: href(`/bundles/${bundleId}`),
    })
    window.location.reload()
  }
}

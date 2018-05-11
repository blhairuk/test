import * as React from "react"

import ScheduleRow from "../components/schedule-row"

export interface Props {
  charges: RechargeCharge[],
}

export default class Schedule extends React.Component<Props> {
  public render() {
    const {charges} = this.props

    return (
      <div>
        <h3>Delivery schedule</h3>
        <p>
          Delivery schedule dates are when your order will be placed.
          Future deliveries will be added to your schedule as the date approaches.
        </p>

        {charges.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Products</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((c) => (
                <ScheduleRow
                  charge={c}
                  key={c.id}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }
}

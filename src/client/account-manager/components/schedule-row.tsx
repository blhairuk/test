import {format as formatDate} from 'date-fns'
import * as React from 'react'

export interface Props {
  charge: RechargeCharge
}

export default class ScheduleRow extends React.Component<Props> {
  render () {
    const {
      charge: {
        line_items,
        scheduled_at,
      }
    } = this.props

    return (
      <tr>
        <td>{formatDate(scheduled_at, 'dddd, MMMM D')}</td>
        <td>{line_items.map(l => l.title).join(', ')}</td>
        <td>{this.controls()}</td>
      </tr>
    )
  }

  private controls = () => {
    const {
      charge: {
        status
      }
    } = this.props

    switch (status) {
      case 'QUEUED':
        return 'Skip'
      case 'SKIPPED':
        return 'Unskip'
    }
  }
}
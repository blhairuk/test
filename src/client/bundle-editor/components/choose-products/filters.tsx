import * as React from "react"

interface Props {
  filters: any
}

export default class Filters extends React.Component<Props> {
  public render() {
    const {filters} = this.props

    return (
      <div>{JSON.stringify(filters)}</div>
    )
  }
}

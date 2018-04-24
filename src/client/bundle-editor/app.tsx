import * as React from 'react'

export default class App extends React.Component<{}> {
  static async getInitialProps (ctx) {
    console.log(ctx)
  }

  render () {
    return (
      <div>bundle editor</div>
    )
  }
}
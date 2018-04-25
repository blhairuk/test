import * as React from 'react'
import {
  Link,
  Route,
} from 'react-router-dom'

import Schedule from './routes/schedule'
import Subscriptions from './routes/subscriptions'

interface IProps {
  data: Object,
  Router: any,
  routerProps: Object,
}

export default class extends React.Component<IProps> {
  render () {
    const {
      Router, 
      routerProps
    } = this.props

    const renderRoute = ({location: {pathname}}) => {
      const props = {data: this.props.data}
      if (pathname.match(/\/schedule/)) return <Schedule {...props} />
      else return <Subscriptions {...props} />
    }

    return (
      <Router {...routerProps}>
        <div>
          <h1>Account Manager</h1>
          <div>
            
          </div>
          <Route children={renderRoute} />
        </div>
      </Router>
    )
  }
}
import * as React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'

import Schedule from './routes/schedule'
import Subscriptions from './routes/subscriptions'

interface IProps {
  data: Object,
  Router: any,
  routerProps: Object,
}

const path = path => `${process.env.APP_PROXY_PATH}/account/:customerHash${path}`

export default class extends React.Component<IProps> {
  render () {
    const {
      Router, 
      routerProps
    } = this.props

    return (
      <Router {...routerProps}>
        <div>
          <h1>Account Manager</h1>

          <Switch>
            <Route
              component={Subscriptions}
              exact
              path={path('/')}
            />
            <Route
              component={Schedule}
              path={path('/schedule')}
            />
            <Route
              component={Subscriptions}
              path={path('/subscriptions')}
            />
          </Switch>
        </div>
      </Router>
    )
  }
}
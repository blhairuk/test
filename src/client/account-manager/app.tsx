import * as React from 'react'
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom'

import Schedule from './routes/schedule'
import Subscriptions from './routes/subscriptions'

interface IProps {
  Router: any,
  routerProps: Object,
}

export default class App extends React.Component<IProps> {
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
              exact
              component={Subscriptions} 
              path='/'
            />
            <Route 
              component={Schedule} 
              path='/schedule'
            />
            <Route 
              component={Subscriptions} 
              path='/subscriptions'
            />
          </Switch>
        </div>
      </Router>
    )
  }
}
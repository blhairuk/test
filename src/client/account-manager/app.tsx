import * as React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'

import Billing from './routes/billing'
import History from './routes/history'
import Schedule from './routes/schedule'
import Subscriptions from './routes/subscriptions'

interface IProps {
  customerHash,
  data: {
    customer: {
      first_name: string,
      last_name: string,
    }
  },
  Router: any,
  routerProps: Object,
}

const path = path => `${process.env.APP_PROXY_PATH}/customer/:customerHash${path}`
const href = (path, customerHash) => `${process.env.APP_PROXY_PATH}/customer/${customerHash}${path}`

export default class App extends React.Component<IProps> {
  render () {
    const {
      customerHash,
      data: {
        customer: {
          first_name: firstName,
          last_name: lastName,
        }
      },
      Router, 
      routerProps
    } = this.props

    return (
      <Router {...routerProps}>
        <div className='grid grid--uniform'>
          <div className='grid__item medium-up--one-third'>
            <h3>{firstName} {lastName}</h3>
            <ul>
              <li><a href={href('/schedule', customerHash)}>Delivery schedule</a></li>
              <li><a href={href('/subscriptions', customerHash)}>Subscriptions</a></li>
              <li><a href={href('/billing', customerHash)}>Billing information</a></li>
              <li><a href={href('/history', customerHash)}>Purchase history</a></li>
            </ul>
          </div>

          <div className='grid__item medium-up--two-thirds'>
            <Switch>
              <Route
                component={Subscriptions}
                exact
                path={path('/')}
              />
              <Route
                component={Billing}
                path={path('/billing')}
              />
              <Route
                component={History}
                path={path('/history')}
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
        </div>
      </Router>
    )
  }
}
import * as React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'

import Billing from './routes/billing'
import History, {Props as HistoryProps} from './routes/history'
import Schedule from './routes/schedule'
import Subscriptions, {Props as SubscriptionProps} from './routes/subscriptions'

interface Data extends HistoryProps, SubscriptionProps {
  customer: {
    first_name: string,
    last_name: string,
  },
}

interface Props {
  customerHash,
  data: Data,
  Router: any,
  routerProps: Object,
}

const path = path => `${process.env.APP_PROXY_PATH}/customer/:customerHash${path}`
const href = (path, customerHash) => `${process.env.APP_PROXY_PATH}/customer/${customerHash}${path}`

export default class App extends React.Component<Props> {
  render () {
    const {
      customerHash,
      data,
      Router, 
      routerProps
    } = this.props

    const {
      customer: {
        first_name: firstName,
        last_name: lastName,
      }
    } = data

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
                path={path('/billing')}
                render={() => <Billing {...data} />}
              />
              <Route
                path={path('/history')}
                render={() => <History {...data} />}
              />
              <Route
                path={path('/schedule')}
                render={() => <Schedule {...data} />}
              />
              <Route
                path={path('/subscriptions')}
                render={() => <Subscriptions {...data} />}
              />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
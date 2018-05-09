import * as React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'

import Billing, {Props as BillingProps} from './components/billing'
import Schedule, {Props as ScheduleProps} from './components/schedule'
import Subscriptions, {Props as SubscriptionProps} from './components/subscriptions'

interface Data extends BillingProps, ScheduleProps, SubscriptionProps {
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

export default class App extends React.Component<Props> {
  render () {
    const {
      data,
      Router, 
      routerProps
    } = this.props

    const {
      customer: {
        first_name,
        last_name,
      }
    } = data

    const routeProps = {...data, href: this.href}

    return (
      <Router {...routerProps}>
        <div className='grid grid--uniform'>
          <div className='grid__item medium-up--one-quarter'>
            <h3>{first_name} {last_name}</h3>
            <ul>
              <li><a href={this.href('/schedule')}>Delivery schedule</a></li>
              <li><a href={this.href('/subscriptions')}>Subscriptions</a></li>
              <li><a href={this.href('/billing')}>Billing information</a></li>
            </ul>
          </div>

          <div className='grid__item medium-up--three-quarters'>
            <Switch>
              <Route
                path={path('/billing')}
                render={() => <Billing {...routeProps} />}
              />
              <Route
                path={path('/schedule')}
                render={() => <Schedule {...routeProps} />}
              />
              <Route
                path={path('/subscriptions')}
                render={() => <Subscriptions {...routeProps} />}
              />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }

  private href = (path, opts = {prefix: null}) => {
    const {customerHash} = this.props
    const prefix = opts.prefix || 'customer'
    return `${process.env.APP_PROXY_PATH}/${prefix}/${customerHash}${path}`
  }
}
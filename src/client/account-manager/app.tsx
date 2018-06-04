import {Box, Flex} from "grid-styled"
import * as React from "react"
import {
  Route,
  Switch,
} from "react-router-dom"

import Home from "./components/home"
import MyBox from "./components/my-box"
import Orders from "./components/orders"

import {SAND} from "../colors"

interface Data {
  customer: ShopifyCustomer,
}

interface Props {
  customerHash,
  data: Data,
  Router: any,
  routerProps: any,
}

const createFullPath = (partialPath) => `${process.env.APP_PROXY_PATH}/account/:shopifyCustomerId${partialPath}`

export default class App extends React.Component<Props> {
  public render() {
    const {
      data,
      Router,
      routerProps,
    } = this.props

    const {
      customer: {
        first_name,
        last_name,
      },
    } = data

    return (
      <Router {...routerProps}>
        <Wrapper>
          <Box width={[1, 1 / 3]}>
            <h3>{first_name} {last_name}</h3>
            <ul className="text-right">
            <li><a href={this.createHref("/")}>My Account</a></li>
              <li><a href={this.createHref("/my-box")}>My Box</a></li>
              <li><a href={this.createHref("/orders")}>Orders</a></li>
              <li><a href={this.createHref("/billing")}>Write a Review</a></li>
              <li><a href={this.createHref("/billing")}>Share with friends</a></li>
            </ul>
          </Box>

          <Box width={[1, 2 / 3]}>
            <Switch>
              <Route
                component={Home}
                exact={true}
                path={createFullPath("/")}
              />
              <Route
                path={createFullPath("/my-box")}
                component={MyBox}
              />
              <Route
                path={createFullPath("/orders")}
                component={Orders}
              />
            </Switch>
          </Box>
        </Wrapper>
      </Router>
    )
  }

  private createHref = (path, opts = {prefix: null}) => {
    const {data: {customer: {id: shopifyCustomerId}}} = this.props
    const prefix = opts.prefix || "account"
    return `${process.env.APP_PROXY_PATH}/${prefix}/${shopifyCustomerId}${path}`
  }
}

const Wrapper = Flex.extend`
  background: ${SAND};
`

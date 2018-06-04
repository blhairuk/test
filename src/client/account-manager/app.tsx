import {Box, Flex} from "grid-styled"
import * as React from "react"
import {
  Route,
  Switch,
} from "react-router-dom"

import Home from "./components/home"
import MyBox, {Props as MyBoxProps} from "./components/my-box"
import Orders from "./components/orders"

import {SAND} from "../colors"

interface Data extends MyBoxProps {
  customer: ShopifyCustomer,
}

interface Props {
  Router: any,
  data: Data,
  routerProps: any,
}

const createFullPath = (partialPath) => `${process.env.APP_PROXY_PATH}/account/:shopifyCustomerId${partialPath}`

export default class App extends React.Component<Props> {
  public render() {
    const {
      Router,
      data,
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
                exact={true}
                path={createFullPath("/")}
                render={this.renderHome}
              />
              <Route
                path={createFullPath("/my-box")}
                render={this.renderMyBox}
              />
              <Route
                path={createFullPath("/orders")}
                render={this.renderOrders}
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

  private renderHome = () => <Home {...this.props} />
  private renderMyBox = () => (
    <MyBox bundles={this.props.data.bundles} />
  )
  private renderOrders = () => <Orders {...this.props} />
}

const Wrapper = Flex.extend`
  background: ${SAND};
  min-height: 700px;
`

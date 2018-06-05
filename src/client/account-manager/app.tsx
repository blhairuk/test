import {Box, Flex} from "grid-styled"
import * as React from "react"
import {
  Route,
  Switch,
} from "react-router-dom"
import styled from "styled-components"

import Billing from "./components/billing"
import Home from "./components/home"
import MyBox, {Props as MyBoxProps} from "./components/my-box"
import Orders from "./components/orders"

import {
  DARK_SAND,
  SAND,
} from "../colors"

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
        <Container>
          <Wrapper mx={-3}>
            <Box
              className="show-for-medium"
              px={3}
              width={[1, 1 / 3]}
            >
              <h3>{first_name} {last_name}</h3>
              <ul className="text-right">
              <li><a href={this.createHref("/")}>My Account</a></li>
                <li><a href={this.createHref("/my-box")}>My Box</a></li>
                <li><a href={this.createHref("/billing")}>Billing Info</a></li>
                <li><a href={this.createHref("/orders")}>Orders</a></li>
                <li><a href={this.createHref("/billing")}>Write a Review</a></li>
                <li><a href={this.createHref("/billing")}>Share with friends</a></li>
              </ul>
            </Box>

            <Box
              px={3}
              style={{backgroundColor: DARK_SAND}}
              width={[1, 2 / 3]}
            >
              <Switch>
                <Route
                  exact={true}
                  path={createFullPath("/")}
                  render={this.renderHome}
                />
                <Route
                  path={createFullPath("/billing")}
                  render={this.renderBilling}
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
        </Container>
      </Router>
    )
  }

  private createHref = (path) => {
    const {data: {customer: {id: shopifyCustomerId}}} = this.props
    return `${process.env.APP_PROXY_PATH}/account/${shopifyCustomerId}${path}`
  }

  private renderBilling = () => <Billing {...this.props} />
  private renderHome = () => <Home {...this.props} />
  private renderMyBox = () => (
    <MyBox
      addresses={this.props.data.addresses}
      bundles={this.props.data.bundles}
      createHref={this.createHref}
      products={this.props.data.products}
    />
  )
  private renderOrders = () => <Orders {...this.props} />
}

const Container = styled.div`
  background: ${SAND};
  display: flex;
  min-height: 700px;
`

const Wrapper = Flex.extend`
  flex: 1;
  margin: 0 auto;
  max-width: 1000px;
`

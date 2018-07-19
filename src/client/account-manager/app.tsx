import {Box, Flex} from "grid-styled"
import * as React from "react"
import {
  Route,
  Switch,
} from "react-router-dom"
import styled from "styled-components"

import Button from "../bundle-editor/components/styled/button"
import Billing, {Props as BillingProps} from "./components/billing"
import EditAddress, {Props as EditAddressProps} from "./components/edit-address"
import Home, {Props as HomeProps} from "./components/home"
import LoadingModal from "./components/loading-modal"
import MyBox, {Props as MyBoxProps} from "./components/my-box"
import OrderDetails, {Props as OrderDetailsProps} from "./components/order-details"
import Orders, {Props as OrderProps} from "./components/orders"

import Modal from "../helpers/modal"
import updateStateKeys from "../helpers/update-state-keys"

import {
  DARK_SAND,
  SAND,
} from "../colors"

interface Data extends BillingProps, EditAddressProps, HomeProps, MyBoxProps, OrderProps, OrderDetailsProps {
  customer: ShopifyCustomer,
}

interface Props {
  Router: any,
  data: Data,
  routerProps: any,
}

interface State {
  isLoadingModalOpen: boolean,
}

const createFullPath = (partialPath) => `${process.env.APP_PROXY_PATH}/account/:shopifyCustomerId${partialPath}`

export default class App extends React.Component<Props, State> {
  public state = {
    isLoadingModalOpen: false,
  }

  public render() {
    const {
      Router,
      data,
      routerProps,
    } = this.props

    const {isLoadingModalOpen} = this.state

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
              mt={3}
              px={3}
              width={[1, 1 / 3]}
            >
              <Name>{first_name} {last_name}</Name>

              <Menu className="text-right">
                <li><a href={this.createHref("/")}>Dashboard</a></li>
                <li><a href={this.createHref("/my-box")}>My Box</a></li>
                <li><a href={this.createHref("/orders")}>Orders</a></li>
                <li><a href={this.createHref("/billing")}>Payment Info</a></li>
                <li><a href="javascript:void(0)" data-st-intent="st:referrals:offers">Share with friends</a></li>
                <li>
                  <MyCoins>My Coins</MyCoins>
                  <MyCoinsSubtitle>
                    <span>You have </span>
                    <span className="sweettooth-points-balance">(loading)</span>
                    <span> Happy Coins</span>
                  </MyCoinsSubtitle>
                  <Button data-st-intent="st:points:rewards" size="small">Redeem points</Button>
                </li>
                <li style={{marginTop: "20px"}}>
                  <a href="/account/logout">Logout</a>
                </li>
              </Menu>
            </Box>

            <Box
              pt={3}
              px={[3, 4]}
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
                  exact={true}
                  path={createFullPath("/orders")}
                  render={this.renderOrders}
                />
                <Route
                  path={createFullPath("/orders/:orderId")}
                  render={this.renderOrderDetails}
                />
                <Route
                  path={createFullPath("/edit-address")}
                  render={this.renderEditAddress}
                />
              </Switch>
            </Box>
          </Wrapper>

          <Modal
            allowClosing={false}
            handleClose={this.handleLoadingModalClose}
            isOpen={isLoadingModalOpen}
            maxWidth={300}
          >
            <LoadingModal />
          </Modal>
        </Container>
      </Router>
    )
  }

  private createHref = (path) => {
    const {data: {customer: {id: shopifyCustomerId}}} = this.props
    return `${process.env.APP_PROXY_PATH}/account/${shopifyCustomerId}${path}`
  }

  private handleLoadingModalClose = () => {
    this.setState(updateStateKeys({isLoadingModalOpen: false}))
  }

  private openLoadingModal = () => {
    this.setState(updateStateKeys({isLoadingModalOpen: true}))
  }

  private renderWithMobileBackHeader = ({Component, title}: {Component: any, title?: string}) => (
    <div>
      <Flex
        alignItems="center"
        className="hide-for-medium"
        mb={3}
        justifyContent="space-between"
      >
        <Box width={1 / 4}>
          <a href={this.createHref("/")}>Back</a>
        </Box>
        <h2 style={{margin: "0"}}>{title}</h2>
        <Box width={1 / 4}>
          <div>&nbsp;</div>
        </Box>
      </Flex>
      {Component}
    </div>
  )

  private renderBilling = () => this.renderWithMobileBackHeader({
    Component: (
      <Billing
        createHref={this.createHref}
        stripeCustomer={this.props.data.stripeCustomer}
      />
    ),
    title: "Payment Info",
  })

  private renderEditAddress = () => this.renderWithMobileBackHeader({
    Component: (
      <EditAddress
        address={this.props.data.address}
        createHref={this.createHref}
        openLoadingModal={this.openLoadingModal}
      />
    ),
    title: "Address",
  })

  private renderHome = () => (
    <Home
      createHref={this.createHref}
      customer={this.props.data.customer}
      stats={this.props.data.stats}
    />
  )

  private renderMyBox = () => this.renderWithMobileBackHeader({
    Component: (
      <MyBox
        addresses={this.props.data.addresses}
        bundles={this.props.data.bundles}
        charges={this.props.data.charges}
        createHref={this.createHref}
        openLoadingModal={this.openLoadingModal}
        products={this.props.data.products}
      />
    ),
  })

  private renderOrders = () => this.renderWithMobileBackHeader({
    Component: (
      <Orders
        createHref={this.createHref}
        orders={this.props.data.orders}
      />
    ),
    title: "Orders",
  })

  private renderOrderDetails = () => this.renderWithMobileBackHeader({
    Component: (
      <OrderDetails
        order={this.props.data.order}
      />
    ),
  })
}

const Container = styled.div`
  background: ${SAND};
  display: flex;
  min-height: 700px;
`

const Menu = styled.ul`
  list-style-type: none;
  li {
    a {
      font-size: 85%;
      text-transform: uppercase;
    }
  }
`

const MyCoins = styled.h6`
  margin: 20px 0 5px;
`

const MyCoinsSubtitle = styled.div`
  font-size: 75%;
  margin-bottom: 5px;
`

const Name = styled.h4`
  margin: 0 0 10px;
  text-align: right;
`

const Wrapper = Flex.extend`
  flex: 1;
  margin: 0 auto;
  max-width: 1000px;
`

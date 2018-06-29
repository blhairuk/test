import {formatMoney} from "accounting"
import {format as formatDate} from "date-fns"
import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  frequencyTitle,
  getBundleIdFromProperties,
  getPathToImages,
  getPrimaryBundleSubscription,
  isBundleIdInProperties,
} from "../../../shared/helpers"

import {
  DARK_SAND,
  YELLOW,
} from "../../colors"

import Button from "../../bundle-editor/components/styled/button"
import Modal from "../../helpers/modal"
import updateStateKeys from "../../helpers/update-state-keys"
import CancelModal from "./cancel-modal"

interface Props {
  addresses: RechargeAddress[],
  charges: RechargeCharge[],
  createHref: (path: string) => any,
  products: ShopifyProduct[],
  openLoadingModal: () => any,
  status: string,
  subscriptions: RechargeSubscription[],
  subtotal: number,
}

interface State {
  isCancelModalOpen: boolean,
}

export default class EditBundle extends React.Component<Props, State> {
  public state = {
    isCancelModalOpen: false,
  }

  public componentDidMount() {
    // this.initCarousel()
  }

  public render() {
    const {
      addresses,
      charges: allCharges,
      createHref,
      products,
      status,
      subscriptions,
      subtotal,
    } = this.props

    const {isCancelModalOpen} = this.state

    const bundle = getPrimaryBundleSubscription(subscriptions)
    // legacy issue: can be ignored
    if (!bundle) { return null }

    const bundleId = getBundleIdFromProperties(bundle.properties)
    const bundleName = bundle.properties.find(({name}) => name === "bundle_name").value
    const frequencyUnitType = bundle.order_interval_unit
    const frequency = parseInt(bundle.order_interval_frequency, 10)
    const isCancelled = status === "CANCELLED"
    const address = addresses.find(({id}) => id === bundle.address_id)
    const bundleProductsQuantities = subscriptions
      .filter(({id}) => id !== bundle.id)
      .map(({quantity, shopify_product_id}) => ({
        product: products.find(({id}) => id === shopify_product_id),
        quantity,
      }))

    const validChargeStatuses = ["QUEUED", "SKIPPED"]
    const charges = allCharges.filter(({line_items, status: chargeStatus}) => (
      validChargeStatuses.includes(chargeStatus) &&
      line_items.some(({properties}) => (
        isBundleIdInProperties(bundleId, properties)
      ))
    ))

    const editImg = (
      <img
        src={getPathToImages("account-icon-edit.svg")}
        style={{height: "16px", width: "16px"}}
      />
    )

    const editItemsHref = createHref(`/bundles/${bundleId}`)

    return (
      <div>
        <h4
          className="text-center"
          style={{margin: "0 0 10px"}}
        >
          {bundleName}
        </h4>

        <Wrapper>
          {isCancelled && (
            <CancelledWrapper alignItems="center" justifyContent="center">
              <Box className="text-center">
                <h3>I'M PAUSED!</h3>
                <Button
                  onClick={this.handleReactivateClick(bundleId)}
                  size="wide"
                >
                  Resume
                </Button>
              </Box>
            </CancelledWrapper>
          )}

          <Flex justifyContent="space-between">
            <SectionTitle style={{marginBottom: "10px"}}>Details</SectionTitle>
          </Flex>

          <Flex
            className="text-center"
            flexWrap="wrap"
          >
            <Box
              my={2}
              width={[1 / 2, 1 / 4]}
            >
              <DetailsTitle>Frequency</DetailsTitle>
              <DetailsValue>{frequencyTitle(frequencyUnitType, frequency)}</DetailsValue>
            </Box>
            <Box
              my={2}
              width={[1 / 2, 1 / 4]}
            >
              <DetailsTitle>Amount</DetailsTitle>
              <DetailsValue>{bundleProductsQuantities.length}</DetailsValue>
            </Box>
            <Box
              my={2}
              width={[1 / 2, 1 / 4]}
            >
              <DetailsTitle>Boosters</DetailsTitle>
              <DetailsValue>TBD</DetailsValue>
            </Box>
            <Box
              my={2}
              width={[1 / 2, 1 / 4]}
            >
              <DetailsTitle>Subtotal</DetailsTitle>
              <DetailsValue>{formatMoney(subtotal)}</DetailsValue>
            </Box>
          </Flex>
          <Line />

          <Flex
            flexWrap="wrap"
            mx={-2}
          >
            <Box
              mb={[3, 0]}
              px={2}
              width={[1, 1 / 2]}
            >
              <Flex
                alignItems="center"
                mb={2}
                justifyContent="space-between"
              >
                <SectionTitle>Shipping to</SectionTitle>
                <a href={createHref(`/edit-address?address_id=${address.id}`)}>
                  {editImg}
                </a>
              </Flex>
              <div>{address.first_name} {address.last_name}</div>
              {address.company && <div>{address.company}</div>}
              <div>{address.address1} {address.address2}</div>
              <div>{address.city}, {address.province} {address.zip}</div>
              <div>{address.phone}</div>
            </Box>
            <Box
              px={2}
              width={[1, 1 / 2]}
            >
              <SectionTitle style={{marginBottom: "10px"}}>Next shipment</SectionTitle>
              {charges.map(({
                id,
                scheduled_at,
                status: chargeStatus,
              }) => (
                <div
                  key={id}
                  style={{marginBottom: "3px"}}
                >
                  <Button
                    color="gray"
                    onClick={this.handleToggleSkipChargeClick(bundleId, id)}
                    size="small"
                  >
                    {chargeStatus === "SKIPPED" ? "Unskip" : "Skip"}
                  </Button>
                  <span>&nbsp;</span>
                  <span style={{textDecoration: chargeStatus === "SKIPPED" ? "line-through" : null}}>
                    {formatDate(scheduled_at, "ddd, MMM D, YYYY")}
                  </span>
                </div>
              ))}
            </Box>
          </Flex>
          <Line />

          <Flex
            alignItems="center"
            mb={3}
            justifyContent="space-between"
          >
            <SectionTitle>{bundleProductsQuantities.length} Items</SectionTitle>
            <a href={editItemsHref}>
              {editImg}
            </a>
          </Flex>
          <Flex
            className="bundle-products-carousel"
            flexWrap="wrap"
            mx={-2}
          >
            {bundleProductsQuantities.map(({product, quantity}) => (
              <ProductWrapper
                key={product.id}
                px={2}
                width={[1 / 3, 1 / 4]}
              >
                <img src={product.image.src} />
                <ProductTitle>{product.title}</ProductTitle>
                {quantity > 1 && <QuantityWrapper>{quantity}</QuantityWrapper>}
              </ProductWrapper>
            ))}
          </Flex>
        </Wrapper>
        <div
          className="text-right"
          style={{marginBottom: "30px"}}
        >
          {!isCancelled && (
            <a
              href="javascript:void(0)"
              onClick={this.handleCancelModalOpen}
            >
              Cancel
            </a>
          )}
        </div>

        <Modal
          handleClose={this.handleCancelModalClose}
          isOpen={isCancelModalOpen}
        >
          <CancelModal
            editItemsHref={editItemsHref}
            submit={this.submitCancel(bundleId)}
          />
        </Modal>
      </div>
    )
  }

  private handleCancelModalClose = () => {
    this.setState(updateStateKeys({isCancelModalOpen: false}))
  }

  private handleCancelModalOpen = () => {
    this.setState(updateStateKeys({isCancelModalOpen: true}))
  }

  private handleReactivateClick = (bundleId) => async () => {
    this.props.openLoadingModal()
    await $.ajax({
      method: "POST",
      url: this.props.createHref(`/bundles/${bundleId}`),
    })
    window.location.reload()
  }

  private handleToggleSkipChargeClick = (bundleId, chargeId) => async () => {
    this.props.openLoadingModal()
    await $.ajax({
      contentType: "application/json",
      dataType: "json",
      method: "POST",
      url: this.props.createHref(`/bundles/${bundleId}/toggle-skip-charge?charge_id=${chargeId}`),
    })
    window.location.reload()
  }

  private submitCancel = (bundleId) => async (cancellation_reason: string) => {
    this.props.openLoadingModal()
    await $.ajax({
      contentType: "application/json",
      data: JSON.stringify({cancellation_reason}),
      dataType: "json",
      method: "DELETE",
      url: this.props.createHref(`/bundles/${bundleId}`),
    })
    window.location.reload()
  }
}

const CancelledWrapper = Flex.extend`
  background-color: rgba(255, 248, 237, 0.9);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
`

const DetailsTitle = styled.div`
  font-size: 90%;
  text-transform: uppercase;
`

const DetailsValue = styled.div`
  font-size: 110%;
  font-weight: bold;
`

const Line = styled.hr`
  border-top: 2px solid ${DARK_SAND};
  margin: 15px 0;
`

const ProductTitle = styled.div`
  font-size: 80%;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
`

const ProductWrapper = Box.extend`
  position: relative;
`

const QuantityWrapper = styled.div`
  background: ${YELLOW};
  border-radius: 15px;
  box-shadow: 0 0px 15px 1px rgba(0, 0, 0, 0.25);
  font-size: 90%;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  position: absolute;
  text-align: center;
  top: 5px;
  right: 10px;
  width: 30px;
`

const SectionTitle = styled.h4`
  font-size: 90%;
  margin-bottom: 0;
  text-transform: uppercase;
`

const Wrapper = styled.div`
  background: #fff;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 15px 20px;
  position: relative;
`

import {format as formatDate} from "date-fns"
import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  frequencyTitle,
  getBundleIdFromProperties,
  getPrimaryBundleSubscription,
} from "../../../shared/helpers"

import {
  DARK_SAND,
  YELLOW,
} from "../../colors"

interface Props {
  addresses: RechargeAddress[],
  charges: RechargeCharge[],
  createHref: (path: string) => any,
  products: ShopifyProduct[],
  subscriptions: RechargeSubscription[],
}

export default class EditBundle extends React.Component<Props> {
  public render() {
    const {
      addresses,
      charges,
      createHref,
      products,
      subscriptions,
    } = this.props

    const bundle = getPrimaryBundleSubscription(subscriptions)
    const bundleId = getBundleIdFromProperties(bundle.properties)
    const bundleName = bundle.properties.find(({name}) => name === "bundle_name").value
    const frequencyUnitType = bundle.order_interval_unit
    const frequency = parseInt(bundle.order_interval_frequency, 10)
    const address = addresses.find(({id}) => id === bundle.address_id)
    const bundleProductsQuantities = subscriptions
      .filter(({id}) => id !== bundle.id)
      .map(({quantity, shopify_product_id}) => ({
        product: products.find(({id}) => id === shopify_product_id),
        quantity,
      }))

    return (
      <div>
        <Title>{bundleName}</Title>

        <Wrapper>
          <Flex justifyContent="space-between">
            <SectionTitle>Details</SectionTitle>
            <div>
              <a href={createHref(`/bundles/${bundleId}`)}>Settings</a>
              <a
                href="javascript:void(0)"
                onClick={this.submitCancel(bundleId)}
              >
                Cancel
              </a>
            </div>
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
              <DetailsValue>TBD</DetailsValue>
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
              <DetailsValue>TBD</DetailsValue>
            </Box>
          </Flex>
          <Line />

          <Flex flexWrap="wrap">
            <Box
              mb={[3, 0]}
              width={[1, 1 / 2]}
            >
              <SectionTitle>Shipping to</SectionTitle>
              <div>{address.first_name} {address.last_name}</div>
              {address.company && <div>{address.company}</div>}
              <div>{address.address1} {address.address2}</div>
              <div>{address.city}, {address.province} {address.zip}</div>
              <div>{address.phone}</div>
              <div>
                <a href={createHref(`/edit-address?address_id=${address.id}`)}>Edit</a>
              </div>
            </Box>
            <Box width={[1, 1 / 2]}>
              <SectionTitle>Upcoming charges</SectionTitle>
              {charges.map(({
                id,
                scheduled_at,
                status,
              }) => (
                <div key={id}>
                  <div>
                    {formatDate(scheduled_at, "dddd, MMMM D, YYYY")}
                    <span>&nbsp;</span>
                    <a onClick={this.handleToggleSkipChargeClick(bundleId, id)}>
                      {status === "SKIPPED" ? "Unskip" : "Skip"}
                    </a>
                  </div>
                </div>
              ))}
            </Box>
          </Flex>
          <Line />

          <SectionTitle>{bundleProductsQuantities.length} Items</SectionTitle>
          <Flex
            flexWrap="wrap"
            mx={-2}
          >
            {bundleProductsQuantities.map(({product, quantity}) => (
              <ProductWrapper
                key={product.id}
                mb={3}
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
      </div>
    )
  }

  private handleToggleSkipChargeClick = (bundleId, chargeId) => async () => {
    await $.ajax({
      contentType: "application/json",
      dataType: "json",
      method: "POST",
      url: this.props.createHref(`/bundles/${bundleId}/toggle-skip-charge?charge_id=${chargeId}`),
    })
    // window.location.reload()
  }

  private submitCancel = (bundleId) => async () => {
    await $.ajax({
      contentType: "application/json",
      dataType: "json",
      method: "DELETE",
      url: this.props.createHref(`/bundles/${bundleId}`),
    })
    window.location.reload()
  }
}

const DetailsTitle = styled.div`
  font-size: 80%;
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
  margin-bottom: 10px;
  text-transform: uppercase;
`

const Title = styled.h3`
  text-align: center;
`

const Wrapper = styled.div`
  background: #fff;
  border-radius: 5px;
  margin-bottom: 30px;
  padding: 15px 20px;
`

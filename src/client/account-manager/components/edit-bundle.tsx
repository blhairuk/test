import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  frequencyTitle,
  getPrimaryBundleSubscription,
} from "../../../shared/helpers"

import {DARK_SAND} from "../../colors"

interface Props {
  addresses: RechargeAddress[],
  products: ShopifyProduct[],
  subscriptions: RechargeSubscription[],
}

export default class EditBundle extends React.Component<Props> {
  public render() {
    const {
      addresses,
      products,
      subscriptions,
    } = this.props

    const bundle = getPrimaryBundleSubscription(subscriptions)
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
          <div>Details</div>
          <Flex>
            <Box width={1 / 4}>
              <DetailsTitle>Frequency</DetailsTitle>
              <DetailsValue>{frequencyTitle(frequencyUnitType, frequency)}</DetailsValue>
            </Box>
            <Box width={1 / 4}>
              <DetailsTitle>Amount</DetailsTitle>
              <DetailsValue>TBD</DetailsValue>
            </Box>
            <Box width={1 / 4}>
              <DetailsTitle>Boosters</DetailsTitle>
              <DetailsValue>TBD</DetailsValue>
            </Box>
            <Box width={1 / 4}>
              <DetailsTitle>Subtotal</DetailsTitle>
              <DetailsValue>TBD</DetailsValue>
            </Box>
          </Flex>
          <Line />
          <div>Shipping</div>
          <div>{address.first_name} {address.last_name}</div>
          <Line />
          <div>Items</div>
          {bundleProductsQuantities.map(({product, quantity}) => (
            <div key={product.id}>
              {product.title} {quantity}
            </div>
          ))}
        </Wrapper>
      </div>
    )
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
  margin: 10px 0;
`

const Title = styled.h3`
  text-align: center;
`

const Wrapper = styled.div`
  background: #fff;
  border-radius: 5px;
`

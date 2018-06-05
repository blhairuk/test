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
  createHref: (path: string) => any,
  products: ShopifyProduct[],
  subscriptions: RechargeSubscription[],
}

export default class EditBundle extends React.Component<Props> {
  public render() {
    const {
      addresses,
      createHref,
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
          <Flex justifyContent="space-between">
            <SectionTitle>Details</SectionTitle>
            <div>
              <a href={createHref(`/bundles/${getBundleIdFromProperties(bundle.properties)}`)}>Settings</a>
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
            </Box>
            <Box width={[1, 1 / 2]}>
              <SectionTitle>Next shipment</SectionTitle>
              <div>{formatDate(bundle.next_charge_scheduled_at, "dddd, MMMM D, YYYY")}</div>
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

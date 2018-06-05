import {formatMoney} from "accounting"
import {format as formatDate} from "date-fns"
import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

interface Props {
  order: ShopifyOrder,
}

export default class Order extends React.Component<Props> {
  public render() {
    const {
      order: {
        created_at,
        financial_status,
        fulfillment_status,
        name,
        total_price,
      },
    } = this.props

    return (
      <Wrapper>
        <Title>Order {name}</Title>
        <Line />
        <Flex>
          <Box width={1 / 4}>
            <DetailsTitle>Date</DetailsTitle>
            <DetailsValue>{formatDate(created_at, "MMM D, YYYY")}</DetailsValue>
          </Box>
          <Box width={1 / 4}>
            <DetailsTitle>Payment</DetailsTitle>
            <DetailsValue>{financial_status}</DetailsValue>
          </Box>
          <Box width={1 / 4}>
            <DetailsTitle>Shipping</DetailsTitle>
            <DetailsValue>{fulfillment_status}</DetailsValue>
          </Box>
          <Box width={1 / 4}>
            <DetailsTitle>Total</DetailsTitle>
            <DetailsValue>{formatMoney(total_price)}</DetailsValue>
          </Box>
        </Flex>
      </Wrapper>
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

const Line = styled.hr``

const Title = styled.h3`
  font-size: 110%;
  text-align: center;
`

const Wrapper = styled.div`
  background: #fff;
  border-radius: 10px;
`

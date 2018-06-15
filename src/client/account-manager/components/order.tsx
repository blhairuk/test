import {formatMoney} from "accounting"
import {format as formatDate} from "date-fns"
import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {DARK_SAND} from "../../colors"

interface Props {
  createHref: (path: string) => any,
  order: ShopifyOrder,
}

const prettifyStatus = (status) => status.replace(/_/g, " ")

export default class Order extends React.Component<Props> {
  public render() {
    const {
      createHref,
      order: {
        created_at,
        financial_status,
        fulfillment_status,
        id,
        name,
        total_price,
      },
    } = this.props

    return (
      <Wrapper>
        <Title>
          <a href={createHref(`/orders/${id}`)}>Order {name}</a>
        </Title>

        <Line />

        <Flex className="text-center">
          <Box width={1 / 4}>
            <DetailsTitle>Date</DetailsTitle>
            <DetailsValue>{formatDate(created_at, "MMM D, YYYY")}</DetailsValue>
          </Box>
          <Box width={1 / 4}>
            <DetailsTitle>Payment</DetailsTitle>
            <DetailsValue>{prettifyStatus(financial_status || "-")}</DetailsValue>
          </Box>
          <Box width={1 / 4}>
            <DetailsTitle>Shipping</DetailsTitle>
            <DetailsValue>{prettifyStatus(fulfillment_status || "-")}</DetailsValue>
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
  text-transform: capitalize;
`

const Line = styled.hr`
  border-color: ${DARK_SAND};
  border-top-width: 2px;
`

const Title = styled.h3`
  font-size: 110%;
  text-align: center;
`

const Wrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 20px;
`

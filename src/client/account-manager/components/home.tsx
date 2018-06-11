import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

interface Props {
  createHref: (path: string) => any,
  customer: ShopifyCustomer,
}

export default class Home extends React.Component<Props> {
  public render() {
    const {
      createHref,
      customer: {
        first_name,
        last_name,
      },
    } = this.props

    return (
      <div>
        <div className="hide-for-medium">
          <Flex
            alignItems="baseline"
            justifyContent="space-between"
          >
            <h2>{first_name} {last_name}</h2>
            <a href={createHref("/logout")}>Logout</a>
          </Flex>

          <Flex
            mx={-2}
            wrap="wrap"
          >
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/my-box")}>
                  <div>My Box</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/billing")}>
                  <div>Billing Info</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/orders")}>
                  <div>Orders</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/my-box")}>
                  <div>Write a Review</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/my-box")}>
                  <div>Share with Friends</div>
                </Link>
              </White>
            </Tile>
          </Flex>
        </div>

        <div className="show-for-medium">
          Home
        </div>
      </div>
    )
  }
}

const Link = styled.a`
  display: block;
  padding: 10px;

  > div {
    font-size: 90%;
    font-weight: bold;
    text-transform: uppercase;
  }
`

const Tile = Box.extend.attrs({
  px: 2,
})`
  margin-bottom: 15px;
  text-align: center;
`

const White = styled.div`
  background-color: #fff;
`

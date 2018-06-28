import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  LIGHT_PURPLE,
  LIGHT_TEAL,
  ORANGE,
} from "../../../client/colors"

import {getPathToImages} from "../../../shared/helpers"
import Button from "../../bundle-editor/components/styled/button"

export interface Props {
  createHref: (path: string) => any,
  customer: ShopifyCustomer,
  stats: {
    foodLbsSaved: number,
    buyingMinsSaved: number,
    preppingMinsSaved: number,
  }
}

export default class Home extends React.Component<Props> {
  public render() {
    const {
      createHref,
      customer: {
        first_name,
        last_name,
      },
      stats: {
        buyingMinsSaved,
        foodLbsSaved,
        preppingMinsSaved,
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
            <a href="/account/logout">Logout</a>
          </Flex>
          <hr style={{margin: "0 0 15px 0"}} />
        </div>

        <div className="text-center">
          <h4 style={{marginBottom: "5px"}}>Happy tracker</h4>
          <small>Earn rewards while you save time, money, and the planet!</small>
          <Flex
            mb={4}
            mt={3}
            justifyContent="space-between"
          >
            <HappyTrackerContainer color={LIGHT_PURPLE}>
              <div className="num">{foodLbsSaved.toFixed(2)}</div>
              <div className="text">minutes saved prepping</div>
            </HappyTrackerContainer>
            <HappyTrackerContainer color={ORANGE}>
              <div className="num">{buyingMinsSaved.toFixed(2)}</div>
              <div className="text">minutes saved vs buying fresh</div>
            </HappyTrackerContainer>
            <HappyTrackerContainer color={LIGHT_TEAL}>
              <div className="num">{preppingMinsSaved.toFixed(2)}</div>
              <div className="text">lbs of food saved vs buying fresh</div>
            </HappyTrackerContainer>
          </Flex>

          <hr />
        </div>
        <div>
          <h4
            className="text-center"
            style={{marginBottom: "15px"}}
          >
            Menu
          </h4>

          <Flex
            mx={[-2, -3]}
            wrap="wrap"
          >
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/my-box")}>
                  <img src={getPathToImages("icon-my-box.png")} />
                  <div>My Box</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/orders")}>
                  <img src={getPathToImages("icon-orders.png")} />
                  <div>Orders</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href={createHref("/billing")}>
                  <img src={getPathToImages("icon-billing.png")} />
                  <div>Billing Info</div>
                </Link>
              </White>
            </Tile>
            <Tile width={1 / 2}>
              <White>
                <Link href="javascript:void(0)" data-st-intent="st:referrals:offers">
                <img src={getPathToImages("icon-share.png")} />
                  <div>Share with friends</div>
                </Link>
              </White>
            </Tile>
            <Tile
              className="hide-for-medium"
              width={1 / 2}
            >
              <White>
                <Link href="javascript:void(0)" data-st-intent="st:points:rewards">
                  <div>
                    <Coins className="sweettooth-points-balance">(loading)</Coins>
                    <div style={{marginBottom: "10px"}}>Happy Coins</div>
                    <Button>Redeem points</Button>
                  </div>
                </Link>
              </White>
            </Tile>
          </Flex>
        </div>
      </div>
    )
  }
}

const Coins = styled.div`
  font-size: 400%;
  font-weight: bold;
  line-height: 1;
`

interface HappyTrackerContainerProps { color: string }
const HappyTrackerContainer = Box.extend`
  border: 3px solid #EAE1D3;
  border-radius: 55px;
  color: ${({color}: HappyTrackerContainerProps) => color};
  display: flex;
  flex-direction: column;
  height: 110px;
  padding: 0 5px;
  justify-content: center;
  width: 110px;

  .num {
    font-size: 200%;
    font-weight: bold;
  }

  .text {
    font-size: 65%;
    line-height: 1;
    text-transform: uppercase;
  }

  @media (min-width:639px) {
    border-radius: 65px;
    height: 130px;
    width: 130px;
  }
`

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
  mb: [3, 4],
  px: [2, 3],
})`
  text-align: center;
`

const White = styled.div`
  background-color: #fff;
`

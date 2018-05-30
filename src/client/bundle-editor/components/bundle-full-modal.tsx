import * as React from "react"
import styled from "styled-components"

import {getPathToImages} from "../../../shared/helpers"
import {TAN} from "../../colors"
import Button from "./styled/button"

interface Props {
  availableSizes: number[],
  bundleProduct: ShopifyProduct,
  closeModal: () => any,
  selectedBundlePrice: number,
  selectedSize: number,
  setSelectedSize: (size: number) => () => any,
  stepNext: () => any,
}

interface State {
  didUpgrade: boolean,
}

export default class BundleFullModal extends React.Component<Props, State> {
  public state = {
    didUpgrade: false,
  }

  public render() {
    const {
      availableSizes,
      bundleProduct,
      closeModal,
      selectedBundlePrice,
      selectedSize,
    } = this.props

    const {
      didUpgrade,
    } = this.state

    const selectedPricePerCup = selectedBundlePrice / selectedSize

    const availableUpgradeVariants = bundleProduct.variants.filter(({option1}) => (
      parseInt(option1, 10) > selectedSize
    ))

    return (
      <Wrapper>
        <XButton
          href="javascript:void(0)"
          onClick={closeModal}
        >
          X
        </XButton>

        <img src={getPathToImages("box-full.png")} />
        {!didUpgrade ? (
          <>
            <Title>YOUR BOX IS FULL!</Title>

            {selectedSize !== availableSizes[availableSizes.length - 1] ? (
              <>
                <p>You did it! But want even more deliciousness in your life? Try upgrading!</p>
                {availableUpgradeVariants.map(({id, option1, price: priceS}) => {
                  const price = parseFloat(priceS)
                  const size = parseInt(option1, 10)
                  const pricePerCup = price / size

                  return (
                    <div key={id}>
                      <Option
                        onClick={this.setSelectedSize(size)}
                      >
                        <div>Upgrade to ${option1}</div>
                        <div><em>Save ${selectedPricePerCup - pricePerCup} per cup</em></div>
                      </Option>
                    </div>
                  )
                })}
                <div>
                  <Option
                    color="white"
                    onClick={this.handleNextStepClick}
                  >
                    NO THANKS! GO TO NEXT STEP
                  </Option>
                </div>
              </>
            ) : (
              <>
                <Option
                  color="white"
                  onClick={this.handleNextStepClick}
                >
                  GO TO NEXT STEP
                </Option>
              </>
            )}
          </>) : (
            <>
              <Title>YOUR BOX JUST GOT BIGGER!</Title>
              <p>Now add some more products to it.</p>
              <Option
                color="white"
                onClick={this.props.closeModal}
              >
                GOT IT
              </Option>
            </>
          )}
      </Wrapper>
    )
  }

  private handleNextStepClick = () => {
    this.props.closeModal()
    this.props.stepNext()
  }

  private setSelectedSize = (size) => () => {
    this.setState({didUpgrade: true})
    this.props.setSelectedSize(size)()
  }
}

const Option = Button.extend`
  margin-bottom: 10px;
`

const Title = styled.h2`
  font-size: 160%;
  margin-bottom: 10px;
`

const Wrapper = styled.div`
  background-color: ${TAN};
  border-radius: 5px;
  color: #000;
  padding-bottom: 10px;
  position: relative;
  text-align: center;
`

const XButton = styled.a`
  display: block;
  font-weight: bold;
  padding: 8px 16px;
  position: absolute;
  right: 0;
  top: 0;
`

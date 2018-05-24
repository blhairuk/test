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

export default class BundleFullModal extends React.Component<Props> {
  public render() {
    const {
      availableSizes,
      bundleProduct,
      closeModal,
      selectedBundlePrice,
      selectedSize,
    } = this.props

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
      </Wrapper>
    )
  }

  private handleNextStepClick = () => {
    this.props.closeModal()
    this.props.stepNext()
  }

  private setSelectedSize = (size) => () => {
    this.props.closeModal()
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

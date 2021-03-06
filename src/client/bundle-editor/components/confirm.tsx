import {formatMoney} from "accounting"
import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  createIdQuantities,
  createImgSrc,
  frequencyTitle,
  getPathToImages,
} from "../../../shared/helpers"

import StepHeader from "./step-header"
import Button from "./styled/button"
import Circle from "./styled/circle"
import FlexWrapper from "./styled/flex-wrapper"

interface Props {
  allProducts: ShopifyProduct[],
  bundleName: string,
  calculateAddOnsPrice: () => number,
  calculateSubtotal: () => number,
  frequencyUnitType: string,
  isActiveStep: boolean,
  isEditingBundle: boolean,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedProductIds: number[],
  selectedSize: number,
  stepGoTo: (step: number) => () => any,
  stepPrev: () => any,
  submit: () => any,
}

export default class Confirm extends React.Component<Props> {
  public render() {
    const {
      allProducts,
      bundleName,
      calculateAddOnsPrice,
      calculateSubtotal,
      frequencyUnitType,
      isEditingBundle,
      isSubmitting,
      selectedAddOnIds,
      selectedFrequency,
      selectedProductIds,
      selectedSize,
      stepGoTo,
      stepPrev,
      submit,
    } = this.props

    const idQuantities = createIdQuantities(selectedProductIds)

    const updateButton = (
      <AddToCartButton
        color="purple"
        disabled={isSubmitting}
        onClick={submit}
        type="button"
      >
        {(() => {
          if (isEditingBundle) { return isSubmitting ? "Updating..." : "Update bundle" }
          return isSubmitting ? "Adding..." : "Add box to cart"
        })()}
      </AddToCartButton>
    )

    const addOnsPrice = calculateAddOnsPrice()
    const subtotal = calculateSubtotal()

    return (
      <div>
        <StepHeader
          stepPrev={stepPrev}
          title="REVIEW YOUR BOX"
        />

        <Flex
          flexWrap="wrap"
          mx={-2}
        >
          <Box
            order={[2, 1]}
            mb={3}
            px={2}
            width={[1, 3 / 5]}
          >
            <MyItemsWrapper>
              <Title>MY ITEMS</Title>
              <a
                href="javascript:void(0)"
                onClick={stepGoTo(3)}
              >
                <img src={getPathToImages("icon-edit.svg")} />
              </a>
            </MyItemsWrapper>

            <Flex
              mx={-2}
              flexWrap="wrap"
            >
              {Object.entries(idQuantities).map(([productIdS, quantity]) => {
                const productId = parseInt(productIdS, 10)
                const product = allProducts.find(({id}) => id === productId)
                const {
                  image: {src},
                  title,
                } = product

                return (
                  <Box
                    className="text-center"
                    key={productId}
                    mb={3}
                    px={3}
                    width={[1 / 2, 1 / 3]}
                  >
                    <ImageWrapper>
                      {quantity > 1 && <QuantityWrapper size={30}>{quantity}</QuantityWrapper>}
                      <img src={createImgSrc(src, "medium")} />
                    </ImageWrapper>
                    <div>{title}</div>
                  </Box>
                )
              })}
            </Flex>
          </Box>

          <Box
            order={[1, 2]}
            px={2}
            width={[1, 2 / 5]}
          >
            <DetailsWrapper>
              <DetailsTitle>{bundleName} details</DetailsTitle>

              <DetailWrapper>
                <div>FREQUENCY</div>
                <div>{frequencyTitle(frequencyUnitType, selectedFrequency)}</div>
              </DetailWrapper>
              <DetailWrapper>
                <div>AMOUNT</div>
                <div>{selectedSize}</div>
              </DetailWrapper>
              <DetailWrapper>
                <div>BOOSTERS</div>
                <div>
                  <span>{selectedAddOnIds.length} </span>
                  <span style={{opacity: 0.5}}>(+{formatMoney(addOnsPrice)})</span>
                </div>
              </DetailWrapper>
              <DetailWrapper style={{borderBottom: "none", marginBottom: "0", paddingBottom: "0"}}>
                <div>SUBTOTAL</div>
                <div>{formatMoney(subtotal)}</div>
              </DetailWrapper>
            </DetailsWrapper>

            <div className="show-for-medium text-center">
              {updateButton}
            </div>
          </Box>

          <Box
            className="hide-for-medium text-center"
            mb={3}
            order={3}
            width={1}
          >
            {updateButton}
          </Box>
        </Flex>
      </div>
    )
  }
}

const AddToCartButton = Button.extend`
  font-size: 105%;
  font-weight: bold;
  padding: 10px 30px;
`

const DetailWrapper = FlexWrapper.extend`
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 5px;
  padding-bottom: 5px;

  > div:first-child { font-size: 80%; }
`

const DetailsTitle = styled.h3`
  font-size: 110%;
  margin-bottom: 10px;
  text-transform: uppercase;
`

const DetailsWrapper = styled.div`
  background: #000;
  border-radius: 6px;
  margin-bottom: 20px;
  padding: 15px;
`

const ImageWrapper = styled.div`
  position: relative;
`

const MyItemsWrapper = FlexWrapper.extend`
  margin-bottom: 20px;
  justify-content: flex-start;
`

const QuantityWrapper = Circle.extend`
  right: 10px;
  top: 2px;
`

const Title = styled.h3`
  font-size: 140%;
  font-weight: normal;
  letter-spacing: 2px;
  margin: 0 20px 0 0;
`

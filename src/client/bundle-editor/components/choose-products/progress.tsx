import * as React from "react"
import styled from "styled-components"

import {
  createIdQuantities,
  findProductByVariantId,
} from "../../../../shared/helpers"

import FlexWrapper, {Col} from "../styled/flex-wrapper"

import {
  BLUE_GREEN,
  LIGHT_PURPLE,
} from "../../../colors"

interface Props {
  bundleName: string,
  bundleProducts: ShopifyProduct[],
  removeVariantId: (productId: number, variantId: number, quantity?: number) => () => any,
  selectedProductIds: number[],
  selectedSize: number,
  selectedVariantIds: number[],
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
}

export default class Progress extends React.Component<Props> {
  public render() {
    const {
      bundleName,
      bundleProducts,
      removeVariantId,
      selectedVariantIds,
      selectedSize,
      updateBundleName,
    } = this.props

    const numSelected = selectedVariantIds.length
    const idQuantities = createIdQuantities(selectedVariantIds)

    return (
      <Wrapper>
        <TopWrapper>
          <FlexWrapper>
            <Col>
              <input
                onChange={updateBundleName}
                type="text"
                value={bundleName}
              />
            </Col>
            <NumSelectedCol>
              {numSelected} of {selectedSize}
            </NumSelectedCol>
          </FlexWrapper>
        </TopWrapper>

        {selectedVariantIds.length > 0 ? (
          <>
            <GradientBar width={(numSelected / selectedSize) || 0} />

            {Object.entries(idQuantities).map(([variantIdS, quantity]: [string, number]) => {
              const variantId = parseInt(variantIdS, 10)
              const product = findProductByVariantId(bundleProducts, variantId)

              // product will not found for add-on items
              if (!product) { return null }

              const {
                id: productId,
                image: {src},
                title,
              } = product

              return (
                <FlexWrapper key={productId}>
                  <LeftCol>
                    {quantity > 1 && <QuantityWrapper>{quantity}</QuantityWrapper>}
                    <img src={src} />
                  </LeftCol>

                  <Col>
                    <small>{title}</small>
                  </Col>

                  <RightCol className="text-center">
                    <XButton
                      href="javascript:void(0)"
                      onClick={removeVariantId(productId, variantId, quantity)}
                    >
                      X
                    </XButton>
                  </RightCol>
                </FlexWrapper>
              )
            })}
          </>
        ) : (
          <div>Choose some products to get started!</div>
        )}
      </Wrapper>
    )
  }
}

interface GradientBarProps {
  width: number,
}

const GradientBar = styled.div`
background: linear-gradient(to right, ${BLUE_GREEN}, ${LIGHT_PURPLE});
height: 12px;
margin: 15px 0 10px;
transform: scale3d(${({width}: GradientBarProps) => width}, 1, 1);
transform-origin: left;
transition: transform 300ms ease-out;
`

const LeftCol = styled.div`
  padding: 8px 12px;
  position: relative;
  width: 25%;
`

const NumSelectedCol = styled.div`
  font-weight: bold;
  text-align: center;
  width: 30%;
`

const RightCol = styled.div`
  width: 11%;
`

const QuantityWrapper = styled.div`
  background: yellow;
  border-radius: 10px;
  color: black;
  font-size: 12px;
  font-weight: bold;
  padding: 3px;
  position: absolute;
  right: 10px;
  text-align: center;
  top: 7px;
  width: 20px;
`

const TopWrapper = styled.div`
  padding: 10px 6px 0;
`

const Wrapper = styled.div`
  background-color: #000;
  border-radius: 10px;
  margin-bottom: 20px;
`

const XButton = styled.a`
  display: block;
  padding: 6px;
`

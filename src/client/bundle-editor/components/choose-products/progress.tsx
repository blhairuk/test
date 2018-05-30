import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  createIdQuantities,
  findProductByVariantId,
} from "../../../../shared/helpers"

import Circle from "../styled/circle"
import GradientBar from "../styled/gradient-bar"

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
        <Box
          pt={2}
          px={2}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
          >
            <Box width={3 / 4}>
              <BoxNameInput
                onChange={updateBundleName}
                type="text"
                value={bundleName}
              />
            </Box>
            <Box>
              <small>
                {numSelected} of {selectedSize}
              </small>
            </Box>
          </Flex>
        </Box>

        <div style={{margin: "15px 0 10px"}}>
          <GradientBar width={(numSelected / selectedSize) || 0} />
        </div>

        {selectedVariantIds.length > 0 ? (
          <>
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
                <Flex
                  alignItems="center"
                  key={productId}
                >
                  <Box
                    p={2}
                    width={1 / 4}
                    style={{position: "relative"}}
                  >
                    {quantity > 1 && <QuantityWrapper size={20}>{quantity}</QuantityWrapper>}
                    <img src={src} />
                  </Box>

                  <Box
                    flex="1"
                    p={1}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <small>{title}</small>
                      <XButton
                        href="javascript:void(0)"
                        onClick={removeVariantId(productId, variantId, quantity)}
                      >
                        X
                      </XButton>
                    </Flex>
                  </Box>
                </Flex>
              )
            })}
          </>
        ) : (
          <div
            className="text-center"
            style={{padding: "10px 20px"}}
          >
            <em>Your box is empty.</em>
          </div>
        )}
      </Wrapper>
    )
  }
}

const BoxNameInput = styled.input`
  border: 0;
  padding: 0;
`

const QuantityWrapper = Circle.extend`
  right: 10px;
  top: 7px;
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

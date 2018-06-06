import {formatMoney} from "accounting"
import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {
  createIdQuantities,
  createImgSrc,
  findProductByVariantId,
  frequencyTitle,
  productTitleWithoutType,
} from "../../../../shared/helpers"

import Circle from "../styled/circle"
import GradientBar from "../styled/gradient-bar"
import TextInput from "../styled/text-input"

interface Props {
  bundleName: string,
  frequencyUnitType: string,
  price: number,
  products: ShopifyProduct[],
  removeVariant: (variant: ShopifyVariant, product: ShopifyProduct, quantity?: number) => () => any,
  selectedFrequency: number,
  selectedIds: number[],
  selectedProductIds: number[],
  selectedSize: number,
  showProgress: boolean,
  updateBundleName: (e: React.ChangeEvent<HTMLInputElement>) => any,
}

export default class Progress extends React.Component<Props> {
  public render() {
    const {
      bundleName,
      frequencyUnitType,
      price,
      products,
      removeVariant,
      selectedFrequency,
      selectedIds,
      selectedSize,
      showProgress,
      updateBundleName,
    } = this.props

    const numSelected = selectedIds.length
    const idQuantities = createIdQuantities(selectedIds)

    return (
      <Wrapper>
        <Box
          pt={2}
          px={2}
        >
          <Flex
            alignItems="center"
            px={1}
            justifyContent="space-between"
          >
            <Box width={3 / 4}>
              <BoxNameInput
                onChange={updateBundleName}
                type="text"
                value={bundleName}
              />
              <small>
                {frequencyTitle(frequencyUnitType, selectedFrequency)}
                <span> &bull; </span>
                {formatMoney(price)}
              </small>
            </Box>
            <Box>
              {showProgress ? (
                <small>{numSelected} of {selectedSize}</small>
              ) : (
                <small>{numSelected} items</small>
              )}
            </Box>
          </Flex>
        </Box>

        {showProgress && (
          <div style={{margin: "15px 0 10px"}}>
            <GradientBar width={(numSelected / selectedSize) || 0} />
          </div>
        )}

        {selectedIds.length > 0 ? (
          <>
            {Object.entries(idQuantities).map(([variantIdS, quantity]: [string, number]) => {
              const variantId = parseInt(variantIdS, 10)
              const product = findProductByVariantId(products, variantId)

              const {
                id: productId,
                image: {src},
                product_type,
                title,
                variants,
              } = product

              const variant = variants.find(({id}) => id === variantId)

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
                    <img src={createImgSrc(src, "medium")} />
                  </Box>

                  <Box
                    flex="1"
                    p={1}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <small>{productTitleWithoutType(title, product_type)}</small>
                      <XButton
                        href="javascript:void(0)"
                        onClick={removeVariant(variant, product, quantity)}
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
            style={{
              opacity: 0.5,
              padding: "10px 20px",
            }}
          >
            <small><em>No products selected.</em></small>
          </div>
        )}
      </Wrapper>
    )
  }
}

const BoxNameInput = TextInput.extend`
  border: none;
  font-size: 100%;
  height: initial;
  margin: 0;
  padding: 0;
  text-align: left;
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

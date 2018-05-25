import {Box, Flex} from "grid-styled"
import * as React from "react"

import {getMetafieldValue} from "../../../shared/helpers"
import Product from "./choose-products/product"
import VideoHero from "./choose-products/video-hero"
import StepHeader from "./step-header"
import Button from "./styled/button"

interface Props {
  addAddOnId: (productId: number, variantId: number) => () => any,
  addVariantId: (productId: number, variantId: number) => () => any,
  bundleAddOns: ShopifyProduct[],
  bundleProducts: ShopifyProduct[],
  bundleProductMetafields: ShopifyProductMetafield[],
  isActiveStep: boolean,
  openProductDetailsModal: (productId: number) => any,
  openVideoModal: (youtubeId: string) => () => any,
  removeAddOnId: (productId: number, variantId: number) => () => any,
  removeVariantId: (productId: number, variantId: number) => () => any,
  selectedAddOnIds: number[],
  selectedVariantIds: number[],
  stepNext: () => any,
  stepPrev: () => any,
}

export default class ChooseAddOns extends React.Component<Props> {
  public render() {
    const {
      addAddOnId,
      addVariantId,
      bundleAddOns,
      bundleProductMetafields,
      openProductDetailsModal,
      openVideoModal,
      removeAddOnId,
      removeVariantId,
      selectedAddOnIds,
      selectedVariantIds,
      stepNext,
      stepPrev,
    } = this.props

    return (
      <div>
        <StepHeader
          stepPrev={stepPrev}
          title="BOOST YOUR BOX"
        />

        <VideoHero
          openVideoModal={openVideoModal}
          title="BOOSTERS"
          youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", "youtube_id_boosters")}
        />

        <Flex
          flexWrap="wrap"
          mx={-2}
        >
          {bundleAddOns.map((product) => (
            <Box
              className="text-center"
              key={product.id}
              px={2}
              py={2}
              width={[1 / 2, 1 / 3]}
            >
              <Product
                addAddOnId={addAddOnId}
                addVariantId={addVariantId}
                isAddOn={true}
                openProductDetailsModal={openProductDetailsModal}
                product={product}
                removeAddOnId={removeAddOnId}
                removeVariantId={removeVariantId}
                selectedAddOnIds={selectedAddOnIds}
                selectedVariantIds={selectedVariantIds}
              />
            </Box>
          ))}
        </Flex>

        <div className="text-center">
          <NextButton
            color="purple"
            onClick={stepNext}
            type="button"
          >
            REVIEW MY BOX
          </NextButton>
        </div>
      </div>
    )
  }
}

const NextButton = Button.extend`
  font-size: 130%;
  font-weight: bold;
  padding: 10px 50px;
  margin-bottom: 30px;
`

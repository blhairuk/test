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
          title="Boosters"
          youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", "youtube_id_boosters")}
        />

        <div className="grid grid--uniform">
          {bundleAddOns.map((product) => (
            <div
              className="grid__item one-half medium-up--one-third text-center"
              key={product.id}
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
            </div>
          ))}
        </div>

        <Button
          className="one-whole"
          color="purple"
          onClick={stepNext}
          type="button"
        >
          Next
        </Button>
      </div>
    )
  }
}

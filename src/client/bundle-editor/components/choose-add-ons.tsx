import * as React from "react"

import {getMetafieldValue} from "../../../shared/helpers"
import VideoHero from "./choose-products/video-hero"
import Button from "./styled/button"

interface Props {
  addAddOnId: (productId: number, variantId: number) => () => any,
  bundleAddOns: ShopifyProduct[],
  bundleProductMetafields: ShopifyProductMetafield[],
  isActiveStep: boolean,
  removeAddOnId: (productId: number, variantId: number) => () => any,
  selectedAddOnIds: number[],
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

export default class ChooseAddOns extends React.Component<Props> {
  public render() {
    const {
      addAddOnId,
      bundleAddOns,
      bundleProductMetafields,
      removeAddOnId,
      selectedAddOnIds,
      stepNext,
      stepPrev,
    } = this.props

    const renderAddOn = ({
      id: productId,
      title,
      image: {src},
      variants,
    }) => {
      const {id: variantId} = variants[0]
      return (
        <div
          className="grid__item medium-up--one-third text-center"
          key={productId}
        >
          <h3 className="h4">{title}</h3>
          <img src={src} />
          <div>
            <button
              onClick={addAddOnId(productId, variantId)}
              type="button"
            >
              Add
            </button>
            <span>{selectedAddOnIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)}</span>
            <button
              onClick={removeAddOnId(productId, variantId)}
              type="button"
            >
              Del
            </button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="grid grid--uniform">
          <div className="grid__item one-tenth">
            <Button
              color="black"
              onClick={stepPrev}
              type="button"
            >
              Prev
            </Button>
          </div>
          <div className="grid__item eight-tenths text-center">
            BOOST YOUR BOX
            </div>
          <div className="grid__item one-tenth text-right">
            &nbsp;
          </div>
        </div>

        <VideoHero
          title="Boosters"
          youtubeId={getMetafieldValue(bundleProductMetafields, "bundle_editor", "youtube_id_boosters")}
        />

        <div className="grid grid--uniform">
          {bundleAddOns.map(renderAddOn)}
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

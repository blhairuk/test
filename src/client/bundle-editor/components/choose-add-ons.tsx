import * as React from "react"

import {getMetafieldValue} from "../../../shared/helpers"
import {Context as AppContext} from "../app"
import VideoHero from "./choose-products/video-hero"
import Button from "./styled/button"

interface Props {
  isActiveStep: boolean,
}

export default class ChooseAddOns extends React.Component<Props> {
  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    addAddOnId,
    bundleAddOns,
    bundleProductMetafields,
    removeAddOnId,
    selectedAddOnIds,
    stepNext,
    stepPrev,
  }) => {
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
          {bundleAddOns.map(({
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
          })}
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

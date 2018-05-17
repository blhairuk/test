import * as React from "react"

import {getMetafieldValue} from "../../../shared/helpers"
import {Context as AppContext} from "../app"
import Product from "./choose-products/product"
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
    bundleAddOns,
    bundleProductMetafields,
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
          {bundleAddOns.map((product) => (
            <div
              className="grid__item medium-up--one-third text-center"
              key={product.id}
            >
              <Product
                isAddOn={true}
                product={product}
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

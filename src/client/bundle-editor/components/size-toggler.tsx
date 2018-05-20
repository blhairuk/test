import * as React from "react"

import Switch from "./styled/switch"

import {BLUE_GREEN} from "../../colors"

interface Props {
  bundleProduct: ShopifyProduct,
  selectedSize: number,
  setSelectedSize: (number) => () => any,
}

export default class SizeToggler extends React.Component<Props> {
  public render() {
    const {
      bundleProduct,
      selectedSize,
      setSelectedSize,
    } = this.props

    const sizes = bundleProduct.variants.map(({option1}) => parseInt(option1, 10))
    const left = sizes.indexOf(selectedSize) * 100

    return (
      <div
        className="grid grid--uniform grid--no-gutters"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          position: "relative",
        }}
      >
        {selectedSize && <Switch left={left} />}

        {sizes.map((size) => (
          <div
            className="grid__item one-half"
            key={size}
            onClick={setSelectedSize(size)}
            style={{
              color: size === selectedSize ? BLUE_GREEN : "#fff",
              position: "relative",
            }}
          >
            {size}
          </div>
        ))}
      </div>
    )
  }
}

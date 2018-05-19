import * as React from "react"

import Switch from "./styled/switch"

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
        style={{position: "relative"}}
      >
        {sizes.map((size) => (
          <div
            className="grid__item one-half"
            key={size}
            onClick={setSelectedSize(size)}
          >
            {size}
          </div>
        ))}

        {selectedSize && <Switch left={left} />}
      </div>
    )
  }
}

import * as React from "react"

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

    return (
      <div className="grid grid--uniform grid--no-gutters">
        {bundleProduct.variants.map(({id, option1}) => {
          const size = parseInt(option1, 10)
          return (
            <div
              className="grid__item one-half"
              key={id}
              onClick={setSelectedSize(size)}
              style={{
                backgroundColor: size === selectedSize ? "#fff" : null,
                color: size === selectedSize ? "#000" : "#fff",
              }}
            >
              {size}
            </div>
          )
        })}
      </div>
    )
  }
}

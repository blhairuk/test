import * as React from "react"

import Switch from "./styled/switch"

import {BLUE_GREEN} from "../../colors"

interface Props {
  availableSizes: number[],
  selectedSize: number,
  setSelectedSize: (number) => () => any,
}

export default class SizeToggler extends React.Component<Props> {
  public render() {
    const {
      availableSizes,
      selectedSize,
      setSelectedSize,
    } = this.props

    const left = availableSizes.indexOf(selectedSize) * 100

    return (
      <div
        className="grid grid--uniform grid--no-gutters"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          borderRadius: "24px",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        {selectedSize && <Switch left={left} />}

        {availableSizes.map((size) => (
          <div
            className="grid__item one-half"
            key={size}
            onClick={setSelectedSize(size)}
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                color: size === selectedSize ? BLUE_GREEN : "#fff",
                fontSize: "350%",
                fontWeight: "bold",
                padding: "0",
              }}
            >
              {size}
            </div>
          </div>
        ))}
      </div>
    )
  }
}

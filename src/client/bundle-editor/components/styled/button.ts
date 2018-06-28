import styled from "styled-components"

import {
  BLUE_GREEN,
  LIGHT_PURPLE,
  YELLOW,
} from "../../../colors"

interface Props {
  color?: "white" | "black" | "yellow" | "purple" | "gray",
  size?: "small" | "wide",
}

const getBackgroundColor = ({color}: Props) => {
  switch (color) {
    case "white":
      return "#fff"
    case "black":
      return "#000"
    case "yellow":
      return YELLOW
    case "purple":
      return LIGHT_PURPLE
    case "gray":
      return "#F0E6D8"
    default:
      return BLUE_GREEN
  }
}

const getColor = ({color}: Props) => {
  switch (color) {
    case "white":
    case "yellow":
    case "gray":
      return "#000"
    case "black":
    default:
      return "#fff"
  }
}

const getFontSize = ({size}: Props) => {
  switch (size) {
    case "small":
      return "65%"
    default:
      return "85%"
  }
}

const getPadding = ({size}: Props) => {
  switch (size) {
    case "small": return "5px 12px"
    case "wide": return "8px 36px"
    default: return "8px 20px"
  }
}

export default styled.button`
  background-color: ${getBackgroundColor};
  border-radius: 15px;
  color: ${getColor};
  display: inline-block;
  font-size: ${getFontSize};
  padding: ${getPadding};
  text-transform: uppercase;

  &:disabled { opacity: 0.5 }
  &:focus {
    box-shadow: none;
    outline-style: none;
  }
`

import styled from "styled-components"

import {
  BLUE_GREEN,
  LIGHT_PURPLE,
  YELLOW,
} from "../../../colors"

interface Props {
  color?: "white" | "black" | "yellow" | "purple"
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
    default:
      return BLUE_GREEN
  }
}

const getColor = ({color}: Props) => {
  switch (color) {
    case "white":
    case "yellow":
      return "#000"
    case "black":
    default:
      return "#fff"
  }
}

export default styled.button`
  background-color: ${getBackgroundColor};
  border-radius: 15px;
  color: ${getColor};
  display: inline-block;
  font-size: 85%;
  padding: 7px 16px;
  text-transform: uppercase;

  &:disabled { opacity: 0.5 }
  &:focus {
    box-shadow: none;
    outline-style: none;
  }
`

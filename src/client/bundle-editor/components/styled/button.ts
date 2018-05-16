import styled from "styled-components"

import {
  BLUE_GREEN,
  YELLOW,
} from "../../../colors"

interface Props {
  color?: "white" | "black" | "yellow"
}

const getBackgroundColor = ({color}: Props) => {
  switch (color) {
    case "white":
      return "#fff"
    case "black":
      return "#000"
    case "yellow":
      return YELLOW
    default:
      return BLUE_GREEN
  }
}

const getColor = ({color}: Props) => {
  switch (color) {
    case "white":
      return "#000"
    case "black":
      return "#fff"
    case "yellow":
      return "#000"
    default:
      return "#fff"
  }
}

export default styled.button`
  background-color: ${getBackgroundColor};
  border-radius: 8px;
  color: ${getColor};
  display: inline-block;
  padding: 6px 18px;
  text-transform: uppercase;

  &:disabled { opacity: 0.5 }
`

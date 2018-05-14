import styled from "styled-components"

import {
  BLUE_GREEN,
  YELLOW,
} from "../../../colors"

const Button = styled.button`
  background-color: ${BLUE_GREEN};
  border-radius: 8px;
  display: inline-block;
  padding: 6px 18px;
  text-transform: uppercase;

  &:disabled { opacity: 0.5 }
`

export default Button

export const YellowButton = Button.extend`background-color: ${YELLOW}`

import styled from "styled-components"

import {
  BLUE_GREEN,
} from "../../../colors"

interface Props {
  isSelected: boolean,
}

export default styled.div`
  background-color: ${({isSelected}: Props) => isSelected ? BLUE_GREEN : "#000"};
  transition: background-color 200ms ease-out;
`

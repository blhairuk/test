import styled from "styled-components"

import {
  BLUE_GREEN,
} from "../../../colors"

interface Props {
  isSelected: boolean,
}

export default styled.div`
  background-color: ${({isSelected}: Props) => isSelected ? BLUE_GREEN : "#000"};
  border-radius: 8px;
  padding: 10px;

  > .fsc-title {
    font-size: 160%;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  > .fsc-subtitle {
    font-size: 80%;
  }

  > .fsc-cpw {
    font-weight: bold;
    margin-bottom: 15px;
    margin-top: 10px;
  }
`

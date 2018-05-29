import styled from "styled-components"

import {
  BLUE_GREEN,
  LIGHT_PURPLE,
} from "../../../colors"

interface Props {
  width: number,
}

export default styled.div`
  background: linear-gradient(to right, ${BLUE_GREEN}, ${LIGHT_PURPLE});
  height: 12px;
  margin: 15px 0 10px;
  transform: scale3d(${({width}: Props) => width}, 1, 1);
  transform-origin: left;
  transition: transform 300ms ease-out;
`

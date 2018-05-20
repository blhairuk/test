import styled from "styled-components"

interface Props {
  left: number,
}

export default styled.div`
  background-color: #fff;
  border-radius: 10px;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate3d(${({left}: Props) => left}%, 0, 0);
  transition: transform 250ms ease-out;
  width: 50%;
`

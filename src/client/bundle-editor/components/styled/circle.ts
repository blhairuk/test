import styled from "styled-components"

interface Props {
  size: number,
}

export default styled.div`
  background: yellow;
  border-radius: ${({size}: Props) => size / 2}px;
  color: black;
  font-size: ${({size}: Props) => size / 1.75}px;
  font-weight: bold;
  line-height: ${({size}: Props) => size}px;
  position: absolute;
  text-align: center;
  width: ${({size}: Props) => size}px;
`

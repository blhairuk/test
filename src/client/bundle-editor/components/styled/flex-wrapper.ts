import styled from "styled-components"

interface Props {
  justifyContent?: string,
  margin?: string,
}

export default styled.div`
  align-items: center;
  display: flex;
  margin: ${({margin}: Props) => margin || "initial"};
  justify-content: ${({justifyContent}: Props) => justifyContent || "space-between"};
`

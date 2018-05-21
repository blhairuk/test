import styled from "styled-components"

interface Props {
  margin?: string,
}

export default styled.div`
  align-items: center;
  display: flex;
  margin: ${({margin}: Props) => margin || "initial"};
  justify-content: space-between;
`

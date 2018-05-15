import styled from "styled-components"

interface Props {
  align?: "top"
}

export default styled.div`
  align-items: ${({align}: Props) => align === "top" ? "start" : "center"};
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 87px); /* 87px = header height */
`

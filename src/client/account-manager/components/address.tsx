import * as React from "react"
import styled from "styled-components"

interface Props {
  address: RechargeAddress,
}

export default class Address extends React.Component<Props> {
  public render() {
    return (
      <Wrapper>Address</Wrapper>
    )
  }
}

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
`

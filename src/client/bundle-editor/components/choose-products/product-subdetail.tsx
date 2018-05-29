import * as React from "react"
import styled from "styled-components"

interface Props {
  content: React.ReactNode,
  title: string,
}

export default class ProductSubdetail extends React.Component<Props> {
  public render() {
    const {
      content,
      title,
    } = this.props

    return (
      <div
        className="text-left"
        style={{marginBottom: "20px"}}
      >
        <div>
          <Title>{title}</Title>
        </div>
        <div>{content}</div>
      </div>
    )
  }
}

const Title = styled.h4`
  font-size: 100%;
  letter-spacing: 2px;
  margin: 10px 0;
`

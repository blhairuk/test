import * as React from "react"
import styled from "styled-components"

import Button from "./styled/button"

interface Props {
  rightSection?: React.ReactNode,
  stepPrev: () => any,
  title: string,
}

const Title = styled.h1`
  margin: 0;
`

export default class StepHeader extends React.Component<Props> {
  public render() {
    const {
      rightSection,
      stepPrev,
      title,
    } = this.props

    return (
      <div className="grid grid--uniform">
        <div className="grid__item one-tenth">
          <Button
            color="black"
            onClick={stepPrev}
            type="button"
          >
            Prev
          </Button>
        </div>

        <div className="grid__item eight-tenths text-center">
          <Title>{title}</Title>
        </div>

        <div className="grid__item one-tenth text-right">
          {rightSection}
        </div>
      </div>
    )
  }
}

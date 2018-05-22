import * as React from "react"

import FlexWrapper from "./styled/flex-wrapper"

import {getPathToImages} from "../../../shared/helpers"

interface Props {
  rightSection?: React.ReactNode,
  stepPrev: () => any,
  title: string,
}

export default class StepHeader extends React.Component<Props> {
  public render() {
    const {
      rightSection,
      stepPrev,
      title,
    } = this.props

    return (
      <FlexWrapper
        margin="12px 0"
      >
        <div style={{width: "10%"}}>
          <a
            href="javascript:void(0)"
            onClick={stepPrev}
            style={{display: "block"}}
          >
            <img src={getPathToImages("icon-arrow.svg")} />
          </a>
        </div>

        <div className="text-center">
          <h1
            style={{
              fontSize: "170%",
              marginBottom: "0",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          className="text-right"
          style={{width: "10%"}}
        >
          {rightSection || <span>&nbsp;</span>}
        </div>
      </FlexWrapper>
    )
  }
}

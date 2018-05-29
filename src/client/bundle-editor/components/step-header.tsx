import * as React from "react"

import FlexWrapper from "./styled/flex-wrapper"

import {getPathToImages} from "../../../shared/helpers"

interface Props {
  centerSection?: React.ReactNode,
  rightSection?: React.ReactNode,
  stepPrev: () => any,
  title?: string,
}

export default class StepHeader extends React.Component<Props> {
  public render() {
    const {
      centerSection,
      rightSection,
      stepPrev,
      title,
    } = this.props

    return (
      <Wrapper>
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
          {centerSection || (
            <h1
              style={{
                fontSize: "170%",
                marginBottom: "0",
              }}
            >
              {title}
            </h1>
          )}
        </div>

        <div
          className="text-right"
          style={{width: "10%"}}
        >
          {rightSection || <span>&nbsp;</span>}
        </div>
      </Wrapper>
    )
  }
}

const Wrapper = FlexWrapper.extend`
  padding: 15px 0;
`

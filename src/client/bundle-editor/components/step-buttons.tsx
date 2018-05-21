import * as React from "react"

import Button from "./styled/button"
import FlexWrapper from "./styled/flex-wrapper"

interface Props {
  hidePrev?: boolean,
  isNextDisabled: boolean,
  stepPrev?: () => any,
}

export default class StepButtons extends React.Component<Props> {
  public render() {
    const {
      hidePrev,
      isNextDisabled,
      stepPrev,
    } = this.props

    return (
      <FlexWrapper>
        <div style={{width: "20%"}}>
          {hidePrev ? <span>&nbsp;</span> : (
            <button
              onClick={stepPrev}
              type="button"
              style={{color: "#fff"}}
            >
              Prev
            </button>
          )}
        </div>

        <div className="text-center">
          <Button
            disabled={isNextDisabled}
            type="submit"
          >
            Next
          </Button>
        </div>

        <div
          className="text-right"
          style={{width: "20%"}}
        >
          &nbsp;
        </div>
      </FlexWrapper>
    )
  }
}

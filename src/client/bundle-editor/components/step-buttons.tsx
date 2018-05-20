import * as React from "react"

import Button from "./styled/button"

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
      <div className="grid grid--uniform grid--no-gutters">
        <div className="grid__item one-quarter text-left">
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

        <div className="grid__item one-half">
          <Button
            disabled={isNextDisabled}
            type="submit"
          >
            Next
          </Button>
        </div>

        <div className="grid__item one-quarter">&nbsp;</div>
      </div>
    )
  }
}

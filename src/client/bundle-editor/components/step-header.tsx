import * as React from "react"

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
      <div className="grid grid--uniform">
        <div className="grid__item one-tenth">
          <button
            onClick={stepPrev}
            type="button"
          >
            Prev
          </button>
        </div>

        <div className="grid__item eight-tenths text-center">
          {title}
        </div>

        <div className="grid__item one-tenth text-right">
          {rightSection}
        </div>
      </div>
    )
  }
}

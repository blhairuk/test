import * as React from "react"

import Button from "./styled/button"
import TextInput from "./styled/text-input"

interface Props {
  enteredName: string,
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  isActiveStep: boolean,
  stepNext: (e: React.FormEvent<HTMLElement>) => any,
}

export default class EnterName extends React.Component<Props> {
  private textInputRef

  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }

  public componentDidUpdate(prevProps) {
    if (!prevProps.isActiveStep && this.props.isActiveStep) {
      this.textInputRef.current.focus()
    }
  }

  public render() {
    const {
      enterName,
      enteredName,
      stepNext,
    } = this.props

    return (
      <div>
        <form onSubmit={stepNext}>
          <h2>BUILD YOUR BOX</h2>
          <div>We'd like to get to know you!</div>
          <div>What's your name?</div>
          <div>
            <TextInput
              autoFocus={true}
              innerRef={this.textInputRef}
              onChange={enterName}
              placeholder="Name"
              required={true}
              type="text"
              value={enteredName}
            />
          </div>
          <div>
            <Button
              disabled={enteredName.length <= 0}
              type="submit"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

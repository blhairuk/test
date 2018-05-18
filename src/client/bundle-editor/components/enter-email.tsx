import * as React from "react"

import Button from "./styled/button"
import TextInput from "./styled/text-input"

interface Props {
  enterEmail: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredEmail: string,
  enteredName: string,
  isActiveStep: boolean,
  stepNext: (e: React.FormEvent<HTMLFormElement>) => any,
  stepPrev: () => any,
}

export default class EnterEmail extends React.Component<Props> {
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
      enterEmail,
      enteredEmail,
      enteredName,
      stepNext,
      stepPrev,
    } = this.props

    return (
      <div>
        <form onSubmit={stepNext}>
          <div>You rock, {enteredName}!</div>
          <div>What's your email?</div>
          <TextInput
            innerRef={this.textInputRef}
            onChange={enterEmail}
            required={true}
            type="email"
            value={enteredEmail}
          />
          <div>
            <Button
              onClick={stepPrev}
              type="button"
            >
              Prev
            </Button>

            <Button
              disabled={enteredEmail.length <= 0}
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

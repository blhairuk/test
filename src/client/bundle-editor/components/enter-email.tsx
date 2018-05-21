import * as React from "react"

import StepButtons from "./step-buttons"
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
        <div className="text-center larger-text">
          <form onSubmit={stepNext}>
            <p><strong>You rock, {enteredName}!<br />What's your email?</strong></p>

            <div style={{marginBottom: "20px"}}>
              <TextInput
                innerRef={this.textInputRef}
                onChange={enterEmail}
                placeholder="Email"
                required={true}
                type="email"
                value={enteredEmail}
              />
            </div>

            <StepButtons
              isNextDisabled={enteredEmail.length <= 0}
              stepPrev={stepPrev}
            />
          </form>
        </div>
      </div>
    )
  }
}

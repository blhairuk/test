import * as React from "react"

import StepButtons from "./step-buttons"
import TextInput from "./styled/text-input"

interface Props {
  enterEmail: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredEmail: string,
  enteredName: string,
  isActiveStep: boolean,
  stepNext: (e?: React.FormEvent<HTMLFormElement>) => any,
  stepPrev: () => any,
}

export default class EnterEmail extends React.Component<Props> {
  private textInputRef

  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }

  public componentWillUnmount() {
    this.textInputRef.current.blur()
  }

  public render() {
    const {
      enterEmail,
      enteredEmail,
      enteredName,
      stepPrev,
    } = this.props

    return (
      <div style={{maxWidth: "350px", width: "100%"}}>
        <div className="text-center larger-text">
          <form onSubmit={this.handleSubmit}>
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

  private handleSubmit = () => {
    const {
      enteredEmail,
      enteredName,
      stepNext,
    } = this.props

    try {
      window._learnq.push(["identify", {
        $email: enteredEmail,
        $first_name: enteredName,
      }])
    } catch (e) {
      console.error(e)
    }

    stepNext()
  }
}

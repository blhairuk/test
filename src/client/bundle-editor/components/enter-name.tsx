import * as React from "react"

import StepButtons from "./step-buttons"
import TextInput from "./styled/text-input"

interface Props {
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredName: string,
  isActiveStep: boolean,
  stepNext: (e?: React.FormEvent<HTMLFormElement>) => any,
}

export default class EnterName extends React.Component<Props> {
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
      enterName,
      enteredName,
      stepNext,
    } = this.props

    return (
      <div>
        <div className="text-center larger-text">
          <form onSubmit={stepNext}>
            <h1>BUILD YOUR BOX</h1>
            <p><strong>We'd like to get to know you!<br />What's your first name?</strong></p>
            <div style={{marginBottom: "20px"}}>
              <TextInput
                innerRef={this.textInputRef}
                onChange={enterName}
                placeholder="Name"
                required={true}
                type="text"
                value={enteredName}
              />
            </div>
            <StepButtons
              hidePrev={true}
              isNextDisabled={enteredName.length <= 0}
            />
          </form>
        </div>
      </div>
    )
  }
}

import * as React from "react"

import Button from "./styled/button"
import TextInput from "./styled/text-input"

import {Context as AppContext} from "../app"

interface Props {
  isActiveStep: boolean,
}

export default class EnterName extends React.Component<Props> {
  private textInputRef

  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }

  public componentDidUpdate(prevProps) {
    if (!prevProps.isActiveStep && this.props.isActiveStep) {
      setTimeout(() => this.textInputRef.current.focus(), 100)
    }
  }

  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    enterName,
    enteredName,
    stepNext,
  }) => (
    <div>
      <form onSubmit={stepNext}>
        <h2>BUILD YOUR BOX</h2>
        <div>We'd like to get to know you!</div>
        <div>What's your name?</div>
        <div>
          <TextInput
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

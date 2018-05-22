import * as React from "react"
import styled from "styled-components"

import {getPathToImages} from "../../../shared/helpers"
import StepButtons from "./step-buttons"
import TextInput from "./styled/text-input"

interface Props {
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredName: string,
  isActiveStep: boolean,
  stepNext: (e: React.FormEvent<HTMLFormElement>) => any,
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
    const {
      enterName,
      enteredName,
      stepNext,
    } = this.props

    return (
      <div>
        <CupsImg src={getPathToImages("cups.png")} />
        <div className="text-center larger-text">
          <form onSubmit={stepNext}>
            <h1>BUILD YOUR BOX</h1>
            <p><strong>We'd like to get to know you!<br />What's your name?</strong></p>
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

const CupsImg = styled.img`
  left: 0;
  position: absolute;
  top: 0;
  width: 400px;
`

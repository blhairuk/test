import * as React from "react"

import Button from "./styled/button"
import TextInput from "./styled/text-input"

interface Props {
  enteredEmail: string,
  enterEmail: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredName: string,
  stepNext: (e: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

export default class EnterEmail extends React.Component<Props> {
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
            autoFocus={true}
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

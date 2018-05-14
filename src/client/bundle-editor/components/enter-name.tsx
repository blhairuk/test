import * as React from "react"

import Button from "./styled/button"

interface Props {
  enteredName: string,
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  stepNext: (e: React.FormEvent<HTMLElement>) => any,
}

export default class EnterName extends React.Component<Props> {
  public render() {
    const {
      enterName,
      enteredName,
      stepNext,
    } = this.props

    return (
      <div>
        <form onSubmit={stepNext}>
          <h2 className="h3">What's your name?</h2>
          <div>
            <input
              onChange={enterName}
              required={true}
              type="text"
              value={enteredName}
            />
          </div>
          <div>
            {enteredName.length > 0 && <Button color="teal" type="submit">Next</Button>}
          </div>
        </form>
      </div>
    )
  }
}

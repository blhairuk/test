import * as React from 'react'

interface Props {
  enteredName: string,
  enterName: (string) => any,
  stepNext: (e: React.FormEvent<HTMLElement>) => any,
}

export default class EnterName extends React.Component<Props> {
  render () {
    const {
      enterName,
      enteredName,
      stepNext,
    } = this.props

    return (
      <div>
        <form onSubmit={stepNext}>
          <h2 className='h3'>What's your name?</h2>
          <div>
            <input 
              onChange={enterName}
              type='text'
              value={enteredName}
            />
          </div>
          <div>
            <button type='submit'>Next</button>
          </div>
        </form>
      </div>
    )
  }
}
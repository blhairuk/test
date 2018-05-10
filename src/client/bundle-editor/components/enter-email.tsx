import * as React from 'react'

interface Props {
  enteredEmail: string,
  enterEmail: (string) => any,
  stepNext: (e: React.FormEvent<HTMLElement>) => any,
}

export default class EnterEmail extends React.Component<Props> {
  render () {
    const {
      enterEmail,
      enteredEmail,
      stepNext,
    } = this.props

    return (
      <div>
        <form onSubmit={stepNext}>
          <h2 className='h3'>What's your email?</h2>
          <input 
            onChange={enterEmail}
            type='text'
            value={enteredEmail}
          />
          <div>
            <button type='submit'>Next</button>
          </div>
        </form>
      </div>
    )
  }
}
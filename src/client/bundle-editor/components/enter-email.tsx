import * as React from 'react'

interface Props {
  enteredEmail: string,
  enterEmail: (string) => any,
  stepNext: (e: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

export default class EnterEmail extends React.Component<Props> {
  render () {
    const {
      enterEmail,
      enteredEmail,
      stepNext,
      stepPrev,
    } = this.props

    return (
      <div>
        <form onSubmit={stepNext}>
          <h2 className='h3'>What's your email?</h2>
          <input 
            onChange={enterEmail}
            required
            type='text'
            value={enteredEmail}
          />
          <div>
            <button 
              onClick={stepPrev}
              type='button'
            >
              Prev
            </button>

            {enteredEmail.length > 0 && (
              <button type='submit'>Next</button>
            )}
          </div>
        </form>
      </div>
    )
  }
}
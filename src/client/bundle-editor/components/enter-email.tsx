import * as React from 'react'

interface Props {
  enteredEmail: string,
  enterEmail: (string) => any,
}

export default class EnterEmail extends React.Component<Props> {
  render () {
    const {
      enterEmail,
      enteredEmail,
    } = this.props

    return (
      <div>
        <h2 className='h3'>What's your email?</h2>
        <input 
          onChange={enterEmail}
          type='text'
          value={enteredEmail}
        />
      </div>
    )
  }
}
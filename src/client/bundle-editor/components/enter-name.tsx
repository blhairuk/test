import * as React from 'react'

interface Props {
  enteredName: string,
  enterName: (string) => any,
}

export default class EnterName extends React.Component<Props> {
  render () {
    const {
      enterName,
      enteredName,
    } = this.props

    return (
      <div>
        <h2 className='h3'>What's your name?</h2>
        <input 
          onChange={enterName}
          type='text'
          value={enteredName}
        />
      </div>
    )
  }
}
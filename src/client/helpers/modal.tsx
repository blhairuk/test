import * as React from 'react'
import * as ReactModal from 'react-modal'

interface Props {
  children: any,
  handleClose: (any) => any,
  isOpen: boolean,
}

export default class Modal extends React.Component<Props> {
  render () {
    const {
      children,
      handleClose,
      isOpen,
    } = this.props

    return (
      <ReactModal 
        isOpen={isOpen}
        onRequestClose={handleClose}
      >
        {children}
      </ReactModal>
    )
  }
}
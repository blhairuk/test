import * as React from "react"
import * as ReactModal from "react-modal"

interface Props {
  children: any,
  handleClose: () => any,
  isOpen: boolean,
}

export default class Modal extends React.Component<Props> {
  public render() {
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

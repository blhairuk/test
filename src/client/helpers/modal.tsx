import * as React from "react"
import * as ReactModal from "react-modal"
import {injectGlobal} from "styled-components"

interface Props {
  children: any,
  handleClose: () => any,
  isOpen: boolean,
  style?: "panel"
}

// tslint:disable-next-line
injectGlobal`
  .bu-modal-content--panel {
    background: #fff;
    border-radius: 0;
    bottom: 0;
    left: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    @media (min-width: 768px) { width: 400px; }
  }
  .bu-modal-overlay--panel {
    background-color: rgba(0, 0, 0, 0.65);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 21;
  }
  .bu-modal-content--default {
    background-color: #fff;
  }
  .bu-modal-overlay--default {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.65);
    bottom: 0;
    display: flex;
    left: 0;
    justify-content: center;
    position: fixed;
    right: 0;
    top: 0;
  }
`

export default class Modal extends React.Component<Props> {
  public render() {
    const {
      children,
      handleClose,
      isOpen,
    } = this.props

    return (
      <ReactModal
        className={this.modalContentClassName()}
        isOpen={isOpen}
        onRequestClose={handleClose}
        overlayClassName={this.modalOverlayClassName()}
      >
        {children}
      </ReactModal>
    )
  }

  private modalContentClassName = () => `bu-modal-content--${this.props.style || "default"}`
  private modalOverlayClassName = () => `bu-modal-overlay--${this.props.style || "default"}`
}

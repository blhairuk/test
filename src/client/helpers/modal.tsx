import * as React from "react"
import * as ReactModal from "react-modal"
import {injectGlobal} from "styled-components"

import {BACKGROUND_BLACK} from "../colors"

interface Props {
  children: any,
  handleClose?: () => any,
  isOpen: boolean,
  style?: "panel"
}

const transitionDuration = "150ms"

// tslint:disable-next-line
injectGlobal`
  .bu-modal-content--panel,
  .bu-modal-content--default {
    background-color: ${BACKGROUND_BLACK};
    color: #fff;
    overflow-y: auto;
    width: 100%;
    -webkit-overflow-scrolling: touch;
  }

  .bu-modal-content--panel {
    border-radius: 0;
    bottom: 0;
    left: auto;
    position: absolute;
    right: 0;
    top: 0;
    transform: translate3d(100%, 0, 0);
    transition: transform ${transitionDuration} ease-out;
    @media (min-width: 768px) { width: 360px }

    &.ReactModal__Content--after-open {
      transform: translate3d(0, 0, 0);
    }
  }

  .bu-modal-content--default {
    margin: 20px;
    @media (min-width: 768px) { width: 600px }
  }

  .bu-modal-overlay--panel,
  .bu-modal-overlay--default {
    background-color: rgba(0, 0, 0, 0.9);
    bottom: 0;
    left: 0;
    position: fixed;
    opacity: 0;
    right: 0;
    top: 0;
    transition: opacity ${transitionDuration} ease-out;
    z-index: 21;

    &.ReactModal__Overlay--after-open {
      opacity: 1;
    }
  }

  .bu-modal-overlay--default {
    align-items: center;
    display: flex;
    justify-content: center;
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

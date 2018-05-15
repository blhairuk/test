import * as React from "react"
import * as ReactModal from "react-modal"

interface Props {
  children: any,
  handleClose: () => any,
  isOpen: boolean,
  style?: "modal" | "panel"
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
        style={this.styles()}
      >
        {children}
      </ReactModal>
    )
  }

  private styles() {
    const {style} = this.props
    if (style === "panel") {
      return {
        content: {
          ...ReactModal.defaultStyles.content,
          borderRadius: 0,
          bottom: 0,
          left: "auto",
          minWidth: "280px",
          right: 0,
          top: 0,
          width: "40%",
        },
        overlay: {
          ...ReactModal.defaultStyles.overlay,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
        },
      }
    }
    return {

    }
  }
}

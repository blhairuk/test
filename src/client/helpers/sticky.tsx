import * as debounce from "debounce"
import * as React from "react"

interface Props {
  offset?: number,
}

export default class Sticky extends React.Component<Props> {
  private nodeRef
  private parentRef

  constructor(props) {
    super(props)
    this.nodeRef = React.createRef()
    this.parentRef = React.createRef()
  }

  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  public render() {
    return (
      <div ref={this.parentRef}>
        <div
          ref={this.nodeRef}
        >
          {this.props.children}
        </div>
      </div>
    )
  }

  // tslint:disable-next-line
  private handleScroll = debounce(() => {
    const nodeRef = this.nodeRef.current
    const parentRef = this.parentRef.current
    const offset = this.props.offset || 0

    if (window.pageYOffset >= (parentRef.offsetTop + offset)) {
      if (nodeRef.style.position !== "absolute") {
        nodeRef.style.position = "absolute"
        nodeRef.style.width = `${parentRef.offsetWidth}px`
      }
      nodeRef.style.top = `${window.scrollY}px`
    } else if (nodeRef.style.position === "absolute") {
      nodeRef.style.position = null
      nodeRef.style.top = null
      nodeRef.style.width = null
    }
  }, 2)
}

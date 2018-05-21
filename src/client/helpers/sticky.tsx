import * as debounce from "debounce"
import * as React from "react"

interface Props {
  disabled?: boolean,
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

  public componentDidUpdate(prevProps) {
    if (!this.props.disabled && prevProps.disabled) {
      this.init()
    } else if (this.props.disabled && !prevProps.disabled) {
      this.teardown()
    }
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

  private init() {
    const nodeRef = this.nodeRef.current
    const transition = "transform 200ms ease-out"
    nodeRef.style.transition = transition
    nodeRef.style.webkitTransition = transition
    window.addEventListener("scroll", this.handleScroll)
  }

  private teardown() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  // tslint:disable-next-line
  private handleScroll = debounce(() => {
    const nodeRef = this.nodeRef.current
    const parentRef = this.parentRef.current
    const parentRect = parentRef.getBoundingClientRect()

    if (parentRect.top <= 0) {
      const transform = `translate3d(0, ${parentRect.top * -1}px, 0)`
      nodeRef.style.transform = transform
      nodeRef.style.webkitTransform = transform
    } else {
      nodeRef.style.transform = null
      nodeRef.style.webkitTransform = null
    }
  }, 10)
}

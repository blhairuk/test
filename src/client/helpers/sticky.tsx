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
    this.init()
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

  private init() {
    const nodeRef = this.nodeRef.current
    const transition = "transform 200ms ease-out"
    nodeRef.style.transition = transition
    nodeRef.style.webkitTransition = transition
  }

  // tslint:disable-next-line
  private handleScroll = debounce(() => {
    const nodeRef = this.nodeRef.current
    const parentRef = this.parentRef.current
    const offset = this.props.offset || 0

    if (window.pageYOffset >= (parentRef.offsetTop + offset)) {
      const transform = `translate3d(0, ${window.scrollY}px, 0)`
      nodeRef.style.transform = transform
      nodeRef.style.webkitTransform = transform
    } else {
      nodeRef.style.transform = null
      nodeRef.style.webkitTransform = null
    }
  }, 10)
}

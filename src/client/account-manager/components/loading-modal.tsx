import * as React from "react"
import styled from "styled-components"

import updateStateKeys from "../../helpers/update-state-keys"

interface State {
  numSecondsOnScreen: number,
}

export default class LoadingModal extends React.Component<{}, State> {
  public state = {
    numSecondsOnScreen: 0,
  }

  private urgencyInterval

  public componentDidMount() {
    this.urgencyInterval = setInterval(this.handleUrgencyInterval, 1000)
  }

  public componentWillUnmount() {
    clearInterval(this.urgencyInterval)
  }

  public render() {
    const {numSecondsOnScreen} = this.state

    return (
      <Wrapper>
        <div>
          {(() => {
            if (numSecondsOnScreen < 5) {
              return "Loading..."
            } else if (numSecondsOnScreen < 10) {
              return "Still Loading..."
            } else {
              return "Sorry, still loading! Thanks for waiting..."
            }
          })()}
        </div>
      </Wrapper>
    )
  }

  private handleUrgencyInterval = () => {
    this.setState(updateStateKeys({numSecondsOnScreen: this.state.numSecondsOnScreen + 1}))
  }
}

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 5px;
  color: #000;
  padding-bottom: 10px;
  position: relative;
  text-align: center;
`

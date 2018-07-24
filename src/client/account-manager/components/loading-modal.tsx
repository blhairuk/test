import * as React from "react"
import {Box, Text} from "rebass"
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
    this.initBodymovinAnimation()
  }

  public componentWillUnmount() {
    clearInterval(this.urgencyInterval)
  }

  public render() {
    const {numSecondsOnScreen} = this.state

    return (
      <Wrapper>
        <Text pt={2}>
          {(() => {
            if (numSecondsOnScreen < 5) {
              return "Loading..."
            } else if (numSecondsOnScreen < 10) {
              return "Still Loading..."
            } else {
              return "Sorry, still loading! Thanks for waiting..."
            }
          })()}
        </Text>
        <Box id="preloader" mx="auto" />
      </Wrapper>
    )
  }

  private handleUrgencyInterval = () => {
    this.setState(updateStateKeys({numSecondsOnScreen: this.state.numSecondsOnScreen + 1}))
  }

  private initBodymovinAnimation = () => {
    if (window.bodymovin) {
      window.bodymovin.loadAnimation({
        autoplay: true,
        container: document.getElementById("preloader"),
        loop: true,
        name: "Build your box",
        path: window.HH.AssetURLs.WhistlingFruit,
        renderer: "svg",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      })
    }
  }
}

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 5px;
  color: #000;
  position: relative;
  text-align: center;
`

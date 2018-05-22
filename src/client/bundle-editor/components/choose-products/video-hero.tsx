import * as React from "react"
import styled from "styled-components"

import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"
import VideoHeroContainer from "../styled/video-hero-container"

interface Props {
  openVideoModal: (youtubeId: string) => () => any,
  title: string,
  youtubeId: string,
}

export default class VideoHero extends React.Component<Props> {
  public render() {
    const {
      openVideoModal,
      title,
      youtubeId,
    } = this.props

    return (
      <VideoHeroContainer
        imageUrl={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
      >
        <div className="text-center">
          <h1
            style={{
              letterSpacing: "1px",
              marginBottom: "15px",
            }}
          >
            {title}
          </h1>

          <Button
            color="white"
            onClick={openVideoModal(youtubeId)}
            type="button"
          >
            <FlexWrapper>
              <strong>WATCH</strong>
              <ArrowContainer>▸</ArrowContainer>
            </FlexWrapper>
          </Button>
        </div>
      </VideoHeroContainer>
    )
  }
}

const ArrowContainer = styled.span`
  margin-left: 6px;
  transform: scale(2);
`

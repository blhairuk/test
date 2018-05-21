import * as React from "react"

import Button from "../styled/button"
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
            WATCH
          </Button>
        </div>
      </VideoHeroContainer>
    )
  }
}

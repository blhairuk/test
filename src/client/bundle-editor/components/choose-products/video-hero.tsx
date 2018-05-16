import * as React from "react"

import Button from "../styled/button"
import VideoHeroContainer from "../styled/video-hero-container"

interface Props {
  title: string,
  youtubeId: string,
}

export default class VideoHero extends React.Component<Props> {
  public render() {
    const {
      title,
      youtubeId,
    } = this.props

    return (
      <VideoHeroContainer
        imageUrl={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
      >
        <div>
          <h1>{title}</h1>
          <Button
            color="white"
            onClick={this.handleButtonClick}
            type="button"
          >
            WATCH
          </Button>
        </div>
      </VideoHeroContainer>
    )
  }

  private handleButtonClick = () => {
    return
  }
}

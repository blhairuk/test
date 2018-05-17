import * as React from "react"

import {Context as AppContext} from "../../app"
import Button from "../styled/button"
import VideoHeroContainer from "../styled/video-hero-container"

interface Props {
  title: string,
  youtubeId: string,
}

export default class VideoHero extends React.Component<Props> {
  public render() {
    return (
      <AppContext.Consumer>
        {this.renderWithContext}
      </AppContext.Consumer>
    )
  }

  private renderWithContext = ({
    openVideoModal,
  }) => {
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

import * as React from "react"

import Modal from "../../../helpers/modal"
import updateStateKeys from "../../../helpers/update-state-keys"

import Button from "../styled/button"
import ResponsiveEmbed from "../styled/responsive-embed"
import VideoHeroContainer from "../styled/video-hero-container"

interface Props {
  title: string,
  youtubeId: string,
}

interface State {
  isModalOpen: boolean
}

export default class VideoHero extends React.Component<Props, State> {
  public state = {
    isModalOpen: false,
  }

  public render() {
    const {
      title,
      youtubeId,
    } = this.props

    const {isModalOpen} = this.state

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

        <Modal
          handleClose={this.handleModalClose}
          isOpen={isModalOpen}
        >
          <ResponsiveEmbed>
            <iframe
              allowFullScreen={true}
              frameBorder={0}
              height={360}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              width={640}
            />
          </ResponsiveEmbed>
        </Modal>
      </VideoHeroContainer>
    )
  }

  private handleButtonClick = () => {
    this.setState(updateStateKeys({isModalOpen: true}))
  }

  private handleModalClose = () => {
    this.setState(updateStateKeys({isModalOpen: false}))
  }
}

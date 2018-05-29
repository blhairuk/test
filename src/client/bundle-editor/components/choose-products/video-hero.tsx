import * as React from "react"
import styled from "styled-components"

import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"

interface Props {
  backgroundImage?: string,
  openVideoModal: (youtubeId: string) => () => any,
  title: string,
  youtubeId: string,
}

export default class VideoHero extends React.Component<Props> {
  public render() {
    const {
      backgroundImage,
      openVideoModal,
      title,
      youtubeId,
    } = this.props

    return (
      <Wrapper imageUrl={backgroundImage}>
        <MobileAdjust>
          <Title>
            {title}
          </Title>

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
        </MobileAdjust>
      </Wrapper>
    )
  }
}

const ArrowContainer = styled.span`
  margin-left: 6px;
  transform: scale(2);
`

const MobileAdjust = styled.div`
  padding-top: 30px;
  position: relative;
  text-align: center;
  top: 18px;

  @media (min-width: 768px) {
    padding-top: 0;
    position: static;
    top: auto;
  }
`

const Title = styled.h1`
  letter-spacing: 1px;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    margin-bottom: 10px;
  }
`

const borderRadius = "8px"

interface WrapperProps {
  imageUrl: string,
}

const Wrapper = styled.div`
  align-items: center;
  background-image: url(${({imageUrl}: WrapperProps) => imageUrl});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${borderRadius};
  display: flex;
  margin-bottom: 20px;
  position: relative;
  justify-content: center;
  z-index: 1;

  @media (min-width: 768px) {
    height: 180px;
    margin-bottom: 10px;
  }

  &::after {
    background: rgba(0, 0, 0, 0.45);
    border-radius: ${borderRadius};
    bottom: 0;
    content: "";
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }
`

import * as React from "react"
import styled from "styled-components"

import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"

import {BACKGROUND_BLACK} from "../../../colors"

interface Props {
  backgroundImage?: string,
  openVideoModal: (youtubeIdKey: string) => () => any,
  title: string,
  youtubeIdKey: string,
}

export default class VideoHero extends React.Component<Props> {
  public render() {
    const {
      backgroundImage,
      openVideoModal,
      title,
      youtubeIdKey,
    } = this.props

    const showButton = !!youtubeIdKey

    return (
      <Wrapper imageUrl={backgroundImage}>
        <MobileAdjust showButton={showButton}>
          <Title>
            {title}
          </Title>

          {showButton && (
            <Button
              color="white"
              onClick={openVideoModal(youtubeIdKey)}
              type="button"
            >
              <FlexWrapper>
                <strong>WATCH</strong>
                <ArrowContainer>▸</ArrowContainer>
              </FlexWrapper>
            </Button>
          )}
        </MobileAdjust>
      </Wrapper>
    )
  }
}

const ArrowContainer = styled.span`
  margin-left: 6px;
  transform: scale(2);
`

interface MobileAdjustProps {
  showButton: boolean,
}

const MobileAdjust = styled.div`
  padding-top: 30px;
  position: relative;
  text-align: center;
  top: ${({showButton}: MobileAdjustProps) => showButton ? "18px" : "0px"};

  @media (min-width: 768px) {
    padding-top: 0;
    position: static;
    top: auto;
  }
`

const Title = styled.h1`
  color: ${BACKGROUND_BLACK};
  letter-spacing: 1px;
  margin-bottom: 30px;
  margin-top: 0;

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
  background-color: #ccc;
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
`

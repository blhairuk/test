import {Box, Flex} from "grid-styled"
import * as React from "react"
import styled from "styled-components"

import {BLUE_GREEN} from "../../colors"

interface Props {
  availableSizes: number[],
  sectionBelow?: React.ReactNode,
  selectedSize: number,
  setSelectedSize: (number) => () => any,
}

export default class SizeToggler extends React.Component<Props> {
  public render() {
    const {
      availableSizes,
      sectionBelow,
      selectedSize,
      setSelectedSize,
    } = this.props

    const left = availableSizes.indexOf(selectedSize) * 100

    return (
      <>
        <Wrapper>
          {selectedSize && <Switch left={left} />}

          {availableSizes.map((size) => (
            <Box
              key={size}
              onClick={setSelectedSize(size)}
              style={{
                position: "relative",
              }}
              width={1 / 2}
            >
              <div
                style={{
                  color: size === selectedSize ? BLUE_GREEN : "#fff",
                  fontSize: "350%",
                  fontWeight: "bold",
                  padding: "0",
                }}
              >
                {size}
              </div>
            </Box>
          ))}
        </Wrapper>

        {sectionBelow && (
          <SectionBelowWrapper
            left={left}
            width={100 / availableSizes.length}
          >
            {sectionBelow}
          </SectionBelowWrapper>
        )}
      </>
    )
  }
}

const borderRadius = 40
const transitionDelay = 250

interface SectionBelowWrapperProps {
  left: number,
  width: number,
}
const SectionBelowWrapper = styled.div`
  transform: translate3d(${({left}: SectionBelowWrapperProps) => left}%, 0, 0);
  transition: transform ${transitionDelay}ms ease-out;
  width: ${({width}: SectionBelowWrapperProps) => width}%;
`

interface SwitchProps {
  left: number,
}
const Switch = styled.div`
  background-color: #fff;
  border-radius: ${borderRadius}px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
  bottom: 0;
  left: 0;
  margin: 2%;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate3d(${({left}: SwitchProps) => left}%, 0, 0);
  transition: transform ${transitionDelay}ms ease-out;
  width: 48%;
`

const Wrapper = Flex.extend`
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: ${borderRadius}px;
  margin-bottom: 10px;
  position: relative;
`

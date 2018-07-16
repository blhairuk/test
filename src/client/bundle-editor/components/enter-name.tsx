import {Box, Flex} from "grid-styled"
import * as React from "react"

import StepButtons from "./step-buttons"
import TextInput from "./styled/text-input"

interface Props {
  enterName: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredName: string,
  isActiveStep: boolean,
  stepNext: (e?: React.FormEvent<HTMLFormElement>) => any,
}

export default class EnterName extends React.Component<Props> {
  private textInputRef

  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }

  public componentWillUnmount() {
    this.textInputRef.current.blur()
  }

  public componentDidMount() {
    this.initBodymovinAnimation()
  }

  public render() {
    const {
      enterName,
      enteredName,
      stepNext,
    } = this.props

    return (
      <Flex
        alignSelf={["start", "stretch"]}
        flexWrap="wrap"
        justifyContent="center"
        width="100%"
      >
        <Flex
          alignItems="start"
          justifyContent="center"
          width={[1, 1 / 2]}
        >
          <BuildYourBoxDiv
            id="build-your-box-intro"
            width={["220px", "100%"]}
          />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          width={[1, 1 / 2]}
        >
          <EnterYourNameDiv className="text-center larger-text">
            <form onSubmit={stepNext}>
              <h1>BUILD YOUR BOX</h1>
              <p><strong>We'd like to get to know you!<br />What's your first name?</strong></p>
              <div style={{marginBottom: "20px"}}>
                <TextInput
                  innerRef={this.textInputRef}
                  onChange={enterName}
                  placeholder="Name"
                  required={true}
                  type="text"
                  value={enteredName}
                />
              </div>
              <StepButtons
                hidePrev={true}
                isNextDisabled={enteredName.length <= 0}
              />
            </form>
          </EnterYourNameDiv>
        </Flex>
      </Flex>
    )
  }

  private initBodymovinAnimation = () => {
    if (window.bodymovin) {
      window.bodymovin.loadAnimation({
        autoplay: true,
        container: document.getElementById("build-your-box-intro"),
        loop: true,
        name: "Build your box",
        path: window.HH.AssetURLs.BuildYourBoxIntro,
        renderer: "svg",
      })
    }
  }
}

const BuildYourBoxDiv = Box.extend`
  @media (min-width: 640px) {
    transform: scale(1.4);
    transform-origin: top;
  }
`

const EnterYourNameDiv = Box.extend`
  @media (min-width: 640px) {
    transform: translate(-70px, -20px);
  }
`

import {Box} from "grid-styled"
import * as React from "react"
import {Text} from "rebass"

import StepButtons from "./step-buttons"
import TextInput from "./styled/text-input"

interface Props {
  enterEmail: (e: React.ChangeEvent<HTMLInputElement>) => any,
  enteredEmail: string,
  enteredName: string,
  isActiveStep: boolean,
  stepNext: (e?: React.FormEvent<HTMLFormElement>) => any,
  stepPrev: () => any,
}

export default class EnterEmail extends React.Component<Props> {
  private textInputRef

  constructor(props) {
    super(props)
    this.textInputRef = React.createRef()
  }

  public componentDidMount() {
    this.initBodymovinAnimation()
  }

  public componentWillUnmount() {
    this.textInputRef.current.blur()
  }

  public render() {
    const {
      enterEmail,
      enteredEmail,
      enteredName,
      stepPrev,
    } = this.props

    return (
      <div style={{maxWidth: "350px", width: "100%"}}>
        <BlobDiv id="blob-intro" />
        <div className="text-center larger-text position-relative">
          <form onSubmit={this.handleSubmit}>
            <Text fontSize={4} fontWeight="bold" mb={3}>You rock, {enteredName}!<br />What's your email?</Text>

            <div style={{marginBottom: "20px"}}>
              <TextInput
                innerRef={this.textInputRef}
                name="email"
                onChange={enterEmail}
                placeholder="Email"
                required={true}
                style={{borderRadius: 0}}
                type="email"
                value={enteredEmail}
              />
            </div>

            <StepButtons
              isNextDisabled={enteredEmail.length <= 0}
              stepPrev={stepPrev}
            />
          </form>
        </div>
      </div>
    )
  }

  private handleSubmit = (e) => {
    e.preventDefault()

    const {
      enteredEmail,
      enteredName,
      stepNext,
    } = this.props

    if (process.env.NODE_ENV === "production") {
      try {
        window._learnq.push(["identify", {
          $email: enteredEmail,
          $first_name: enteredName,
        }])
        window._learnq.push(["track", "Started Bundle Builder"])
      } catch (e) {
        console.error(e)
      }
    }

    stepNext()
  }

  private initBodymovinAnimation = () => {
    if (window.bodymovin) {
      window.bodymovin.loadAnimation({
        autoplay: true,
        container: document.getElementById("blob-intro"),
        loop: true,
        name: "Blob",
        path: window.HH.AssetURLs.Blob2,
        renderer: "svg",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      })
    }
  }
}

const BlobDiv = Box.extend`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
`

import {Box} from "grid-styled"
import * as React from "react"
import {Checkbox, Label, Link, Small, Textarea} from "rebass"
import styled from "styled-components"

import {
  SAND,
} from "../../colors"

import Button from "../../bundle-editor/components/styled/button"
import updateStateKeys from "../../helpers/update-state-keys"

interface Props {
  editItemsHref: string,
  skipCharge: () => any,
  submit: (cancellation_reason: string) => any,
}

interface State {
  comment: string,
  reasons: string[],
  step: number,
}

const REASONS = [
  "I have more than I need right now",
  "This is too expensive",
  "Not enough variety",
  "Shipping is too slow",
  "No reason, just need to pause",
]

class CancelModal extends React.Component<Props, State> {
  public state = {
    comment: "",
    reasons: [],
    step: 0,
  }

  public render() {
    const {editItemsHref} = this.props

    const {
      comment,
      reasons,
      step,
    } = this.state

    switch (step) {
      case 0:
      return (
        <Wrapper>
          <h3>Before you go!</h3>
          <p>By pausing your plan, you'll cancel all future deliveries. You can resume at anytime.
            Alternatively, you can skip your next shipment or select different items.</p>
          <Box my={3}>
            <Button onClick={this.handleSkipClick}>Skip next shipment</Button>
          </Box>
          <Box my={3}>
            <Button>
              <Link color="white" href={editItemsHref}>Select new items</Link>
            </Button>
          </Box>
          <Box>
            <small>
              <a
                href="javascript:void(0)"
                onClick={this.handleContinueCancelClick}
              >
                I'D RATHER PAUSE MY PLAN
              </a>
            </small>
          </Box>

        </Wrapper>
      )

      case 1:
      return (
        <Wrapper>
          <form onSubmit={this.handleSubmit}>
            <h3>So sad to see you go!</h3>
            <p>Please let us know why you are pausing. We're always looking for ways to improve!</p>
            <Box my={3}>
              {REASONS.map((reason) => (
                <Reason key={reason}>
                  <Checkbox
                    checked={reasons.includes(reason)}
                    onClick={this.handleReasonClick(reason)}
                  /> {reason}
                </Reason>
              ))}

              <Textarea
                bg="white"
                my={3}
                placeholder="Additional comments..."
                onChange={this.handleCommentChange}
                rows={4}
                value={comment}
              />
            </Box>
            <Box my={2}>
              <Button
                disabled={!this.cancellationReasonsString()}
                size="wide"
                type="submit"
              >
                Submit & Pause
              </Button>
            </Box>
            <Box>
              <Small>By clicking, you are pausing your box and all future deliveries.</Small>
            </Box>
          </form>
        </Wrapper>
      )
    }
  }

  private cancellationReasonsString = () => this.state.reasons.concat(this.state.comment).join("; ")

  private handleCommentChange = (e) => {
    this.setState(updateStateKeys({comment: e.target.value}))
  }

  private handleContinueCancelClick = () => {
    this.setState(updateStateKeys({step: 1}))
  }

  private handleReasonClick = (reason) => () => {
    const {reasons} = this.state
    const index = reasons.indexOf(reason)

    if (index === -1) {
      reasons.push(reason)
    } else {
      reasons.splice(index, 1)
    }

    this.setState(updateStateKeys({reasons}))
  }

  private handleSkipClick = () => this.props.skipCharge()

  private handleSubmit = async (e) => {
    e.preventDefault()
    await this.props.submit(this.cancellationReasonsString())
  }
}

export default CancelModal

const Reason = Label.extend`
  font-family: Noyh Regular;
  font-size: 100%;
  letter-spacing: 0;
  margin: 8px 0;
  text-transform: none;
`

const Wrapper = styled.div`
  background-color: ${SAND};
  border-radius: 10px;
  color: #000;
  margin: 0 auto;
  max-width: 400px;
  padding: 20px;
  text-align: center;
`

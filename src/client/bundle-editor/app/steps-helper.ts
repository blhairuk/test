import * as React from "react"
import updateStateKeys from "../../helpers/update-state-keys"
import App from "../app"

export interface Helper {
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e?: React.FormEvent<HTMLElement>) => any,
}

export default (app: App) => ({
  stepNext(e) {
    if (e) { e.preventDefault() }
    app.setState(updateStateKeys({currentStepIndex: app.state.currentStepIndex + 1}))
  },

  stepPrev(e) {
    if (e) { e.preventDefault() }
    app.setState(updateStateKeys({currentStepIndex: app.state.currentStepIndex - 1}))
  },
})

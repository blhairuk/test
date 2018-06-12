import * as React from "react"
import updateStateKeys from "../../helpers/update-state-keys"
import App from "../app"

export interface Helper {
  stepGoTo: (step: number) => (e?: React.FormEvent<HTMLElement>) => any,
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e?: React.FormEvent<HTMLElement>) => any,
}

export default (app: App) => ({
  stepGoTo: (step) => (e?) => {
    if (e) { e.preventDefault() }
    app.setState(updateStateKeys({currentStepIndex: step + (app.isEditingSubscription() ? 2 : 0)}))
  },

  stepNext(e?) {
    if (e) { e.preventDefault() }
    app.setState(updateStateKeys({currentStepIndex: app.state.currentStepIndex + 1}))
  },

  stepPrev(e?) {
    if (e) { e.preventDefault() }
    app.setState(updateStateKeys({currentStepIndex: app.state.currentStepIndex - 1}))
  },
})

import * as React from "react"
import {hydrate} from "react-dom"
import * as ReactModal from "react-modal"

import App from "./app"

ReactModal.setAppElement("#app")
ReactModal.defaultStyles.overlay.zIndex = 21

const renderApp = (Component) => {
  let AppTree

  try {
    const {AppContainer} = require("react-hot-loader")
    AppTree = (
      <AppContainer>
        <Component {...window.AppProps} />
      </AppContainer>
    )
  } catch (e) {
    AppTree = <Component {...window.AppProps} />
  }

  hydrate(AppTree, document.getElementById("app"))
}

renderApp(App)

if (module.hot) {
  module.hot.accept("./app", () => {
    renderApp(require("./app").default)
  })
}

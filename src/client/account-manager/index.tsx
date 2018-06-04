import * as React from "react"
import {hydrate} from "react-dom"
import * as ReactModal from "react-modal"
import {BrowserRouter} from "react-router-dom"

import App from "./app"

ReactModal.setAppElement("#app")

const renderApp = (Component) => {
  const component = (
    <Component
      {...window.AppProps}
      Router={BrowserRouter}
    />
  )

  let AppTree

  try {
    const {AppContainer} = require("react-hot-loader")
    AppTree = (
      <AppContainer>
        {component}
      </AppContainer>
    )
  } catch (e) {
    AppTree = component
  }

  hydrate(AppTree, document.getElementById("app"))
}

renderApp(App)

if (module.hot) {
  module.hot.accept("./app", () => {
    renderApp(require("./app").default)
  })
}

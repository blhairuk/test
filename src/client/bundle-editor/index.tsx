import * as React from "react"
import {hydrate} from "react-dom"
import * as ReactModal from "react-modal"

import App from "./app"

ReactModal.setAppElement("#app")
ReactModal.defaultStyles.overlay.zIndex = 21

hydrate(
  <App {...window.AppProps} />,
  document.getElementById("app"),
)

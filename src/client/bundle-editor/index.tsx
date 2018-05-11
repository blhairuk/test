import * as React from "react"
import {hydrate} from "react-dom"
import * as ReactModal from "react-modal"

import App from "./app"

ReactModal.setAppElement("#app")

hydrate(
  <App {...window.AppProps} />,
  document.getElementById("app"),
)

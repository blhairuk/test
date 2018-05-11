import * as React from "react"
import {hydrate} from "react-dom"
import {BrowserRouter} from "react-router-dom"

import App from "./app"

hydrate(
  <App
    {...window.AppProps}
    Router={BrowserRouter}
  />,
  document.getElementById("app"),
)

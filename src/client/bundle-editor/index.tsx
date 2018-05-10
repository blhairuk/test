import * as React from 'react'
import * as ReactModal from 'react-modal'
import {hydrate} from 'react-dom'

import App from './app'

ReactModal.setAppElement('#app')

hydrate(
  <App {...window['AppProps']} />,
  document.getElementById('app')
)
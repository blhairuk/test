declare global {
  interface Window {
    Bundle: any
  }
}

import {
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from './cart'

const BUNDLE_ID_ATTR = 'data-cb-rem-cart-bundle-id'

window.Bundle = window.Bundle || {
  didInit: false,

  initListeners () {
    if (this.didInit) return
    this.didInit = true

    $('#CartDrawer, #CartPage').on(
      'click', 
      `[${BUNDLE_ID_ATTR}]`, 
      async evt => {
        const bundleId = parseInt($(evt.target).attr(BUNDLE_ID_ATTR))

        await removeBundleIdFromCart(bundleId)

        if (window.location.pathname === '/cart') {
          return window.location.reload()
        }

        updateCartDrawerUI()
      }
    )
  },
}

$(() => {
  window.Bundle.initListeners()
})
declare global {
  interface Window {
    Bundle: any
  }
}

import {
  removeBundleIdFromCart,
  updateCartDrawerUI,
} from "./helpers/cart"

const BUNDLE_ID_ATTR = "data-cb-rem-cart-bundle-id"
const SUBMITTING_TEXT = "Removing..."

window.Bundle = window.Bundle || {
  didInit: false,

  initListeners() {
    if (this.didInit) { return }
    this.didInit = true

    $("#CartDrawer, #CartPage").on(
      "click",
      `[${BUNDLE_ID_ATTR}]`,
      async (evt) => {
        const $this = $(evt.target)

        if ($this.html() === SUBMITTING_TEXT) { return false }
        $this.html(SUBMITTING_TEXT)

        await removeBundleIdFromCart(parseInt($this.attr(BUNDLE_ID_ATTR)))

        if (window.location.pathname === "/cart") {
          return window.location.reload()
        }

        updateCartDrawerUI()
      },
    )
  },
}

$(() => {
  window.Bundle.initListeners()
})

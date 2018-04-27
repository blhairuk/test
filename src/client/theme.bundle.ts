declare var Bundle;

Bundle = {
  async addToCart (data) {
    return $.ajax({
      data,
      dataType: 'json',
      type: 'POST',
      url: '/cart/add.js',
    })
  },

  async fetchCart () {
    return $.getJSON('/cart')
  },

  initListeners () {
    $('#CartDrawer, #CartPage').on(
      'click', 
      '[data-cb-rem-cart-bundle-id]', 
      async evt => {
        const bundleId = parseInt($(evt.target).attr('data-cb-rem-cart-bundle-id'))

        await this.removeBundleIdFromCart(bundleId)

        if (window.location.pathname === '/cart') {
          return window.location.reload()
        }

        this.updateCartDrawerUI()
      }
    )
  },

  async removeBundleIdFromCart (bundleId) {
    const {items} = await this.fetchCart()
  
    const updates = items.map(({
      id, 
      properties: {
        bundle_id: itemBundleId,
        parent_bundle_id: itemParentBundleId,
      }, 
      quantity
    }) => ((
      itemBundleId === bundleId || 
      itemParentBundleId === bundleId
    ) ? 0 : quantity))
  
    return this.updateCart(updates)
  },

  async updateCart (updates) {
    return $.ajax({
      data: {updates},
      dataType: 'json',
      type: 'POST',
      url: '/cart/update.js',
    })
  },

  updateCartDrawerUI () {
    $('body').trigger('added.ajaxProduct')
  }
}

$(() => {
  Bundle.initListeners()
})
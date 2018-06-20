export const addToCart = async (data) => (
  $.ajax({
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
    method: "POST",
    url: "/cart/add.js",
  })
)

export const fetchCart = () => $.getJSON("/cart")

export const removeBundleIdFromCart = async (bundleId) => {
  const {items} = await fetchCart()

  const updates = items.map(({
    properties,
    quantity,
  }) => (properties && properties.bundle_id === bundleId) ? 0 : quantity)

  return updateCart(updates)
}

export const updateCart = (updates) => (
  $.ajax({
    contentType: "application/json",
    data: JSON.stringify({updates}),
    dataType: "json",
    method: "POST",
    url: "/cart/update.js",
  })
)

export const updateCartDrawerUI = () => $("body").trigger("added.ajaxProduct")

const getBundleIdProperty = (properties) => (
  properties.find(({name}) => name.includes("bundle_id"))
)

export const createBundleId = () => (new Date()).getTime()

export const getBundleIdFromProperties = (properties) => {
  // the earliest version of the app uses "parent_bundle_id", so we'd
  // like to deprecate that, but there are still orders in the system
  const property = getBundleIdProperty(properties)
  if (property) { return property.value }
}

export const getPropertyValueForKey = (properties, key) => {
  const property = properties.find(({name}) => name === key)
  if (property) {
    return property.value
  }
}

export const findProductByVariantId = (products, variantId) => (
  products.find(({variants}) => variants.find(({id}) => id === variantId))
)

export const isBundleIdInProperties = (bundleId, properties) => {
  const property = getBundleIdProperty(properties)
  return property && property.value === bundleId
}

// turns an array of [1, 1, 1, 2, 2, 3] into {1: 3, 2: 2, 3: 1}
export const createIdQuantities = (ids) => (
  ids.reduce((obj, id) => {
    obj[id] = (obj[id] || 0) + 1
    return obj
  }, {})
)

export const getMetafieldValue = (metafields, namespace, key) => {
  const property = metafields.find(({key: mkey, namespace: mnamespace}) => (
    key === mkey && namespace === mnamespace
  ))
  return property ? property.value : null
}

export const frequencyTitle = (unitType, frequency) => {
  if (frequency === 1 && unitType === "Weeks") { return "Weekly" }
  if (frequency === 4 && unitType === "Weeks") { return "Monthly" }
}

export const frequencySingularTitle = (unitType, frequency) => {
  if (frequency === 1 && unitType === "Weeks") { return "Week" }
  if (frequency === 4 && unitType === "Weeks") { return "Month" }
}

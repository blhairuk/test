const getBundleIdProperty = properties => properties.find(p => p.name.includes('bundle_id'))

export const getBundleIdFromProperties = properties => {
  // the earliest version of the app uses "parent_bundle_id", so we'd 
  // like to deprecate that, but there are still orders in the system
  const property = getBundleIdProperty(properties)
  if (property) {
    return property.value
  }
}
export const isBundleIdInProperties = (bundleId, properties) => {
  const property = getBundleIdProperty(properties)
  console.log(`${property && property.value} ${bundleId}`)
  return property && property.value === bundleId
}
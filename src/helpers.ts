export const getBundleIdFromProperties = properties => {
  // the earliest version of the app uses "parent_bundle_id", so we'd 
  // like to deprecate that, but there are still orders in the system
  const property = properties.find(p => p.name.includes('bundle_id'))
  if (property) {
    return property.value
  }
}
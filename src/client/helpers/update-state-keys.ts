export default (keys) => (prevState) => ({
  ...prevState,
  ...keys,
})

export default keys => (prevState, props) => ({
  ...prevState,
  ...keys,
})
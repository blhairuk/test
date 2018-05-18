export default (keys) => (prevState) => ({
  ...prevState,
  ...keys,
})

export const updateStateKeysWithContextValue = (keys) => (prevState) => ({
  ...prevState,
  ...keys,
  contextValue: {
    ...prevState.contextValue,
    ...keys,
  },
})

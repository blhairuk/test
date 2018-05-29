export const createProductFilterTag = (category, name) => `${category} - ${name}`

export const extractNameFromTag = (tag) => tag.split(" - ")[1]

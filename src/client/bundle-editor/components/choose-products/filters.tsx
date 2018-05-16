import * as React from "react"

import createProductFilterTag from "../../../helpers/create-product-filter-tag"
import Button from "../styled/button"

interface Props {
  activeFilters: string[],
  filters: any,
  resetFilters: () => any,
  toggleFilter: (filterTag: string) => () => any,
}

export default class Filters extends React.Component<Props> {
  public render() {
    const {
      activeFilters,
      filters,
      resetFilters,
      toggleFilter,
    } = this.props

    const renderFilter = (category) => (filter) => {
      const filterTag = createProductFilterTag(category, filter)

      return (
        <Button
          color={activeFilters.includes(filterTag) ? "black" : undefined}
          key={filter}
          onClick={toggleFilter(filterTag)}
          type="button"
        >
          {filter}
        </Button>
      )
    }

    const renderFilters = ([category, names]) => (
      <div key={category}>
        <h4>{category}</h4>
        {names.map(renderFilter(category))}
      </div>
    )

    return (
      <div>
        <div>
          <a onClick={resetFilters}>Reset</a>
        </div>
        {filters.map(renderFilters)}
      </div>
    )
  }
}

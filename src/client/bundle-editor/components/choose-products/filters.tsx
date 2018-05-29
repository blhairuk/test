import * as React from "react"
import styled from "styled-components"

import {createProductFilterTag} from "../../../helpers/filters"
import Button from "../styled/button"
import FlexWrapper from "../styled/flex-wrapper"

interface Props {
  activeFilters: string[],
  closeModal: () => any,
  filters: Array<[string, string[]]>,
  resetFilters: () => any,
  toggleFilter: (filterTag: string) => () => any,
}

export default class Filters extends React.Component<Props> {
  public render() {
    const {
      activeFilters,
      closeModal,
      filters,
      resetFilters,
      toggleFilter,
    } = this.props

    return (
      <div>
        <Header>
          <FlexWrapper>
            <HeaderLink onClick={closeModal}>DONE</HeaderLink>
            <Title>FILTERS</Title>
            <HeaderLink onClick={resetFilters}>RESET</HeaderLink>
          </FlexWrapper>
        </Header>

        <FiltersWrapper>
          {filters.map(([category, names]) => (
            <div key={category}>
              <CategoryTitle>{category.toUpperCase()}</CategoryTitle>

              {names.map((filter) => {
                const filterTag = createProductFilterTag(category, filter)

                return (
                  <Filter
                    color={activeFilters.includes(filterTag) ? "yellow" : "black"}
                    key={filter}
                    onClick={toggleFilter(filterTag)}
                    type="button"
                  >
                    {filter}
                  </Filter>
                )
              })}

              <Line />
            </div>
          ))}
        </FiltersWrapper>
      </div>
    )
  }
}

const CategoryTitle = styled.div`
  font-size: 130%;
  letter-spacing: 3px;
  margin: 20px 0;
`

const Filter = Button.extend`
  margin: 3px 6px;
`

const FiltersWrapper = styled.div`
  overflow-y: auto;
  padding: 0 20px;
  text-align: center;
`

const Header = styled.div`
  box-shadow: 0 0px 15px 1px #000;
  padding: 10px 0;
`

const HeaderLink = styled.a.attrs({
  href: "javascript:void(0)",
})`
  color: #fff;
  font-size: 80%;
  letter-spacing: 1px;
  padding: 15px 20px;
`

const Line = styled.hr`
  margin: 20px auto;
  width: 70%;
`

const Title = styled.h2`
  font-size: 150%;
  letter-spacing: 2px;
  margin: 0;
`

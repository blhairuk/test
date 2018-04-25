import * as React from 'react'
import styled from 'styled-components'

interface IProps {
  frequencies: string[],
  selectedFrequency: number,
  setSelectedFrequency: (number) => any,
  unitType: string,
}

interface IGridItemProps {
  selected: boolean,
}

const GridItem = styled.div`
  border: ${({selected}: IGridItemProps) => selected ? '1px solid red' : '1px solid transparent'};
  cursor: pointer;
`

export default class ChooseFrequency extends React.Component<IProps> {
  render () {
    const {
      frequencies,
      selectedFrequency,
      setSelectedFrequency,
      unitType,
    } = this.props

    return (
      <div>
        <h2 className='h3'>Choose your frequency:</h2>
        <div className='grid grid--uniform'>
          {frequencies.map(frequency => (
            <GridItem
              className='grid__item medium-up--one-third text-center' 
              key={frequency}
              onClick={setSelectedFrequency.bind(this, parseInt(frequency))}
              selected={selectedFrequency === parseInt(frequency)}
            >
              {frequency} {unitType}
            </GridItem>
          ))}
        </div>
      </div>
    )
  }
}
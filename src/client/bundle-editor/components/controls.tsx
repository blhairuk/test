import * as React from 'react'

interface IProps {
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedSize: number,
  selectedVariantIds: number[],
  submit: (any) => any,
}

interface IState {
  submitting: boolean
}

export default class Controls extends React.Component<IProps, IState> {
  public state = {
    submitting: false
  }

  render () {
    const {
      selectedAddOnIds,
      selectedFrequency,
      selectedSize,
      selectedVariantIds,
      submit
    } = this.props

    const {submitting} = this.state

    if (!selectedSize || !selectedFrequency) return null
    if (selectedVariantIds.length !== selectedSize) return null

    return (
      <div>
        <button
          className='btn'
          disabled={submitting}
          onClick={submit} 
          type='button'
        >
          {submitting ? 'Adding...' : 'Add to cart'}
        </button>
      </div>
    )
  }
}
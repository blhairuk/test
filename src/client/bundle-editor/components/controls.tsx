import * as React from 'react'

interface Props {
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedSize: number,
  selectedVariantIds: number[],
  submit: (any) => any,
}

interface State {
  submitting: boolean
}

export default class Controls extends React.Component<Props, State> {
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
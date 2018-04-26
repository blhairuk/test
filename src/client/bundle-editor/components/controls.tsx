import * as React from 'react'

interface Props {
  isEditingBundle: boolean,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedSize: number,
  selectedVariantIds: number[],
  submit: (any) => any,
}

export default class Controls extends React.Component<Props> {
  render () {
    const {
      isEditingBundle,
      isSubmitting,
      selectedAddOnIds,
      selectedFrequency,
      selectedSize,
      selectedVariantIds,
      submit
    } = this.props

    if (!selectedSize || !selectedFrequency) return null
    if (selectedVariantIds.length !== selectedSize) return null

    return (
      <div>
        <button
          className='btn'
          disabled={isSubmitting}
          onClick={submit} 
          type='button'
        >
          {this.buttonText()}
        </button>
      </div>
    )
  }

  private buttonText = () => {
    const {
      isEditingBundle,
      isSubmitting,
    } = this.props

    if (isEditingBundle) return isSubmitting ? 'Updating...' : 'Update bundle'
    return isSubmitting ? 'Adding...' : 'Add to cart'
  }
}
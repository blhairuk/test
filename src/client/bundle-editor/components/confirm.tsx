import * as React from 'react'

interface Props {
  enteredName: string,
  isEditingBundle: boolean,
  isSubmitting: boolean,
  selectedAddOnIds: number[],
  selectedFrequency: number,
  selectedSize: number,
  selectedVariantIds: number[],
  stepPrev: (e?: React.FormEvent<HTMLElement>) => any,
  submit: (any) => any,
}

export default class Confirm extends React.Component<Props> {
  render () {
    const {
      enteredName,
      isSubmitting,
      selectedFrequency,
      selectedSize,
      selectedVariantIds,
      submit
    } = this.props

    let errorMessage
    if (!enteredName) errorMessage = 'Enter a name'
    else if (!selectedSize) errorMessage = 'Enter a size'
    else if (!selectedFrequency) errorMessage = 'Enter a frequency'
    else if (selectedVariantIds.length < selectedSize) errorMessage = 'You need to add products'
    else if (selectedVariantIds.length > selectedSize) errorMessage = 'You need to remove products'
    if (errorMessage) return <div>{errorMessage}</div>

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
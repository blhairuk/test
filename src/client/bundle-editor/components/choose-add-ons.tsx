import * as React from "react"

interface Props {
  addAddOnId: (productId: number, variantId: number) => () => any,
  bundleAddOns: ShopifyProduct[],
  removeAddOnId: (productId: number, variantId: number) => () => any,
  selectedAddOnIds: number[],
  stepNext: (e?: React.FormEvent<HTMLElement>) => any,
  stepPrev: (e: React.FormEvent<HTMLElement>) => any,
}

export default class ChooseAddOns extends React.Component<Props> {
  public render() {
    const {
      addAddOnId,
      bundleAddOns,
      removeAddOnId,
      selectedAddOnIds,
      stepNext,
      stepPrev,
    } = this.props

    return (
      <div>
        <div className="grid grid--uniform">
        {bundleAddOns.map(({
            id: productId,
            title,
            image: {src},
            variants: [{id: variantId}],
          }) => (
            <div
              className="grid__item medium-up--one-third text-center"
              key={productId}
            >
              <h3 className="h4">{title}</h3>
              <img src={src} />
              <div>
                <button
                  onClick={addAddOnId(productId, variantId)}
                  type="button"
                >
                  Add
                </button>
                <span>{selectedAddOnIds.reduce((sum, id) => sum + (id === variantId ? 1 : 0), 0)}</span>
                <button
                  onClick={removeAddOnId(productId, variantId)}
                  type="button"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={stepPrev}
            type="button"
          >
            Prev
          </button>

          <button
            onClick={stepNext}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    )
  }
}

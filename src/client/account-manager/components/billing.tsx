import * as React from "react"

export interface Props {
  stripeCustomer: StripeCustomer,
}

export default class Billing extends React.Component<Props> {
  public render() {
    const {stripeCustomer} = this.props

    const card = stripeCustomer.sources.data.find((s) => s.id === stripeCustomer.default_source)

    const {
      address_city,
      address_line1,
      address_line2,
      address_state,
      address_zip,
      exp_month,
      exp_year,
      last4,
      name,
    } = card

    return (
      <div>
        <h3>Billing Info</h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Name on Card</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
            />
          </div>
          <div>
            <label htmlFor="number">Card Number</label>
            <input
              id="number"
              name="number"
              type="number"
              value={last4}
            />
          </div>
          <div>
            <label htmlFor="exp_month">Exp. Month</label>
            <input
              id="exp_month"
              name="exp_month"
              type="number"
              value={exp_month}
            />
          </div>
          <div>
            <label htmlFor="exp_year">Exp. Year</label>
            <input
              id="exp_year"
              name="exp_year"
              type="number"
              value={exp_year}
            />
          </div>
          <div>
            <label htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              name="cvv"
              type="number"
            />
          </div>

          <hr />

          <div>
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={address_city}
            />
          </div>
          <div>
            <label htmlFor="line1">Line 1</label>
            <input
              id="line1"
              name="line1"
              type="text"
              value={address_line1}
            />
          </div>
          <div>
            <label htmlFor="line2">Line 2</label>
            <input
              id="line2"
              name="line2"
              type="text"
              value={address_line2}
            />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              value={address_state}
            />
          </div>
          <div>
            <label htmlFor="zip">Zip</label>
            <input
              id="zip"
              name="zip"
              type="text"
              value={address_zip}
            />
          </div>
          <div>
            <button
              className="button"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  }

  private handleSubmit = (e) => {
    e.preventDefault()
    alert("This does not work yet")
  }
}

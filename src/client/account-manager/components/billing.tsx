import * as React from "react"
import {injectGlobal} from "styled-components"

import updateStateKeys from "../../helpers/update-state-keys"

export interface Props {
  createHref: (path: string) => any,
  stripeCustomer: StripeCustomer,
}

interface State {
  address_city: string,
  address_country: string,
  address_line1: string,
  address_line2: string,
  address_state: string,
  address_zip: string,
  name: string,
}

// tslint:disable-next-line
injectGlobal`
  .card {
    background-color: #fff;
    border: 1px solid #cacaca;
    border-radius: 50px;
    background-color: #fefefe;
    box-shadow: inset 0 1px 2px rgba(10,10,10,0.1);
    line-height: 1.5;
    height: 2.4375rem;
    margin: 0 0 1rem;
    padding: 0.5rem;
  }
`

export default class Billing extends React.Component<Props, State> {
  public state = {
    address_city: "",
    address_country: "",
    address_line1: "",
    address_line2: "",
    address_state: "",
    address_zip: "",
    name: "",
  }

  private card: any
  private stripe: any

  public componentDidMount() {
    if (window.Stripe) {
      this.initStripe()
    } else {
      document.querySelector("#stripe-js").addEventListener("load", this.initStripe)
    }
  }

  public render() {
    const card = this.props.stripeCustomer.sources.data[0]

    return (
      <div>
        <h3 className="show-for-medium">Billing Info</h3>

        <p>
          Current card is {card.brand} ending in {card.last4}.
        </p>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              onChange={this.handleInputChange("name")}
              type="text"
              value={this.state.name}
            />
          </div>

          <div
            className="card"
            id="card"
          />

          <div>
            <label htmlFor="address_line1">Address Line 1</label>
            <input
              id="address_line1"
              name="address_line1"
              onChange={this.handleInputChange("address_line1")}
              type="text"
              value={this.state.address_line1}
            />
          </div>
          <div>
            <label htmlFor="address_line2">Address Line 2</label>
            <input
              id="address_line2"
              name="address_line2"
              onChange={this.handleInputChange("address_line2")}
              type="text"
              value={this.state.address_line2}
            />
          </div>
          <div>
            <label htmlFor="address_city">City</label>
            <input
              id="address_city"
              name="address_city"
              onChange={this.handleInputChange("address_city")}
              type="text"
              value={this.state.address_city}
            />
          </div>
          <div>
            <label htmlFor="address_state">State</label>
            <input
              id="address_state"
              name="address_state"
              onChange={this.handleInputChange("address_state")}
              type="text"
              value={this.state.address_state}
            />
          </div>
          <div>
            <label htmlFor="address_country">Country</label>
            <input
              id="address_country"
              name="address_country"
              onChange={this.handleInputChange("address_country")}
              type="text"
              value={this.state.address_country}
            />
          </div>
          <div>
            <label htmlFor="address_zip">Zip</label>
            <input
              id="address_zip"
              name="address_zip"
              onChange={this.handleInputChange("address_zip")}
              type="text"
              value={this.state.address_zip}
            />
          </div>
          <button>Submit</button>
        </form>

        <script
          id="stripe-js"
          src="https://js.stripe.com/v3/"
        />
      </div>
    )
  }

  private handleInputChange = (key) => (e) => {
    this.setState(updateStateKeys({[key]: e.target.value}))
  }

  private handleSubmit = async (e) => {
    e.preventDefault()

    const stripeResult = await this.stripe.createToken(this.card, this.state)

    if (stripeResult.error) {
      alert(stripeResult.error.message)
    } else if (stripeResult.token) {
      const {createHref} = this.props

      try {
        await $.ajax({
          contentType: "application/json",
          data: JSON.stringify({
            card: stripeResult.token.card.id,
            token: stripeResult.token.id,
          }),
          dataType: "json",
          method: "PUT",
          url: createHref("/cards"),
        })

        window.location.reload()
      } catch (e) {
        alert("Error updating credit card.")
      }
    }
  }

  private initStripe() {
    this.stripe = window.Stripe(process.env.STRIPE_PUBLISHABLE_TOKEN)
    const elements = this.stripe.elements()
    this.card = elements.create("card")
    this.card.mount("#card")
  }
}

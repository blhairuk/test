import * as React from "react"

export interface Props {
  createHref: (path: string) => any,
  stripeCustomer: StripeCustomer,
}

export default class Billing extends React.Component<Props> {
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
        <h3>Billing Info</h3>

        <p>
          Current card is {card.brand} ending in {card.last4}.
        </p>

        <form onSubmit={this.handleSubmit}>
          <div id="card" />
          <button>Submit</button>
        </form>

        <script
          id="stripe-js"
          src="https://js.stripe.com/v3/"
        />
      </div>
    )
  }

  private handleSubmit = async (e) => {
    e.preventDefault()

    const stripeResult = await this.stripe.createToken(this.card)

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

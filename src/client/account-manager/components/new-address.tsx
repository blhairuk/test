import * as React from "react"

import updateStateKeys from "../../helpers/update-state-keys"

interface Props {
  createHref: (path: string) => any,
}

interface State {
  address1: string,
  address2: string,
  city: string,
  company: string,
  country: string,
  first_name: string,
  last_name: string,
  phone: string,
  province: string,
  zip: string,
}

export default class NewAddress extends React.Component<Props, State> {
  public state = {
    address1: "",
    address2: "",
    city: "",
    company: "",
    country: "",
    first_name: "",
    last_name: "",
    phone: "",
    province: "",
    zip: "",
  }

  public render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              onChange={this.handleInputChange("first_name")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              onChange={this.handleInputChange("last_name")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="address1">Street Address</label>
            <input
              id="address1"
              name="address1"
              onChange={this.handleInputChange("address1")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="address2">Suite or Apt #</label>
            <input
              id="address2"
              name="address2"
              onChange={this.handleInputChange("address2")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              onChange={this.handleInputChange("company")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              onChange={this.handleInputChange("country")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="province">State</label>
            <input
              id="province"
              name="province"
              onChange={this.handleInputChange("province")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              onChange={this.handleInputChange("city")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="zip">Zip</label>
            <input
              id="zip"
              name="zip"
              onChange={this.handleInputChange("zip")}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              onChange={this.handleInputChange("phone")}
              type="text"
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

  private handleInputChange = (key) => (e) => {
    this.setState(updateStateKeys({[key]: e.target.value}))
  }

  private handleFormSubmit = async (e) => {
    e.preventDefault()

    const {
      createHref,
    } = this.props

    try {
      await $.ajax({
        contentType: "application/json",
        data: JSON.stringify(this.state),
        dataType: "json",
        method: "POST",
        url: createHref("/addresses"),
      })

      window.location.href = createHref("/my-box")
    } catch (e) {
      alert("Error creating address")
    }
  }
}

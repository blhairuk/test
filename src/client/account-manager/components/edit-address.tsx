import * as React from "react"

import updateStateKeys from "../../helpers/update-state-keys"

export interface Props {
  address: RechargeAddress,
  createHref: (path: string) => any,
  openLoadingModal: () => any,
}

export default class EditAddress extends React.Component<Props, RechargeAddress> {
  public state = this.props.address

  public render() {
    return (
      <div>
        <h3 className="show-for-medium text-center">Address</h3>

        <form onSubmit={this.handleFormSubmit}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              name="first_name"
              onChange={this.handleInputChange("first_name")}
              type="text"
              value={this.state.first_name}
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              id="last_name"
              name="last_name"
              onChange={this.handleInputChange("last_name")}
              type="text"
              value={this.state.last_name}
            />
          </div>
          <div>
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              onChange={this.handleInputChange("company")}
              type="text"
              value={this.state.company}
            />
          </div>
          <div>
            <label htmlFor="address1">Street Address</label>
            <input
              id="address1"
              name="address1"
              onChange={this.handleInputChange("address1")}
              type="text"
              value={this.state.address1}
            />
          </div>
          <div>
            <label htmlFor="address2">Suite or Apt #</label>
            <input
              id="address2"
              name="address2"
              onChange={this.handleInputChange("address2")}
              type="text"
              value={this.state.address2}
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              onChange={this.handleInputChange("city")}
              type="text"
              value={this.state.city}
            />
          </div>
          <div>
            <label htmlFor="province">State</label>
            <input
              id="province"
              name="province"
              onChange={this.handleInputChange("province")}
              type="text"
              value={this.state.province}
            />
          </div>
          <div>
            <label htmlFor="zip">Zip</label>
            <input
              id="zip"
              name="zip"
              onChange={this.handleInputChange("zip")}
              type="text"
              value={this.state.zip}
            />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              onChange={this.handleInputChange("country")}
              type="text"
              value={this.state.country}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              onChange={this.handleInputChange("phone")}
              type="text"
              value={this.state.phone}
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

    this.props.openLoadingModal()

    const {
      address,
      createHref,
    } = this.props

    try {
      await $.ajax({
        contentType: "application/json",
        data: JSON.stringify(this.state),
        dataType: "json",
        method: "PUT",
        url: createHref(`/addresses/${address.id}`),
      })

      window.location.href = createHref("/my-box")
    } catch (e) {
      alert("Error updating address")
    }
  }
}

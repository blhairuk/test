import * as React from 'react'

export interface Props {
  stripeCustomer: StripeCustomer
}

export default class Billing extends React.Component<Props> {
  render () {
    const {
      stripeCustomer: {
        default_source,
        email,
        sources,
      },
    } = this.props

    const card = sources.data.find(s => s.id === default_source)

    const {
      address_city,
      address_line1,
      address_line2,
      address_state,
      address_zip,
      brand,
      exp_month,
      exp_year,
      last4,
      name,
    } = card

    return (
      <div>
        <h3>Billing information</h3>

        <table className='full table--responsive'>
          <tbody>
            <tr>
              <td>
                <strong>Card on file</strong>
              </td>
              <td>
                <p>{brand} ending in {last4}<br />Expires in {exp_month}/{exp_year}</p>
                <p>
                  <a>Update card</a>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Billing information</strong>
              </td>
              <td>
                <p>
                  {name}<br />
                  {address_line1} {address_line2}<br />
                  {address_city}, {address_state} {address_zip}
                </p>
                <p>{email}</p>
                <p>
                  <a>Edit</a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
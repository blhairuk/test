import * as React from "react"
import styled from "styled-components"

interface Props {
  address: RechargeAddress,
  bundleId: number,
  createHref: (path: string) => any,
}

export const addressDiv = (address: RechargeAddress) => {
  return (
    <div>
      <div>{address.first_name} {address.last_name}</div>
      {address.company && <div>{address.company}</div>}
      <div>{address.address1} {address.address2}</div>
      <div>{address.city}, {address.province} {address.zip}</div>
      <div>{address.phone}</div>
    </div>
  )
}

export default class Address extends React.Component<Props> {
  public render() {
    const {
      address,
  } = this.props

    return (
      <Wrapper>
        <div>{addressDiv(address)}</div>
        <div>
          <a onClick={this.handleUseAddressClick(address.id)}>Use</a>
          <span>&nbsp;</span>
          <a onClick={this.handleDeleteAddressClick(address.id)}>Delete</a>
        </div>
      </Wrapper>
    )
  }

  private handleDeleteAddressClick = (addressId) => async () => {
    const {
      createHref,
    } = this.props

    try {
      await $.ajax({
        contentType: "application/json",
        dataType: "json",
        method: "DELETE",
        url: createHref(`/addresses/${addressId}`),
      })

      window.location.reload()
    } catch (e) {
      alert("Unable to delete address")
    }
  }

  private handleUseAddressClick = (addressId) => async () => {
    const {
      createHref,
      bundleId,
    } = this.props

    await $.ajax({
      contentType: "application/json",
      data: JSON.stringify({addressId}),
      dataType: "json",
      method: "PUT",
      url: createHref(`/bundles/${bundleId}/update-address`),
    })

    window.location.href = createHref("/my-box")
  }
}

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
`

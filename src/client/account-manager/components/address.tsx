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
      {address.company && <div>address.company</div>}
      <div>{address.address1} {address.address2}</div>
      <div>{address.city}, {address.province} {address.zip}</div>
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
        </div>
      </Wrapper>
    )
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

import {Box, Flex} from "grid-styled"
import * as React from "react"

import Address from "./address"

export interface Props {
  addresses: RechargeAddress[],
  bundleId: number,
  createHref: (path: string) => any,
}

export default class EditAddress extends React.Component<Props> {
  public render() {
    const {
      addresses,
      bundleId,
      createHref,
    } = this.props

    return (
      <div>
        <h2>Choose an address</h2>
        <Flex
          flexWrap="wrap"
          mx={-3}
        >
          {addresses.map((address) => (
            <Box
              key={address.id}
              px={3}
              width={[1, 1 / 2]}
            >
              <Address
                address={address}
                bundleId={bundleId}
                createHref={createHref}
              />
            </Box>
          ))}
        </Flex>

        <a>Add new address</a>
      </div>
    )
  }
}

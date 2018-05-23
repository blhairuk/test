import * as React from "react"
import styled from "styled-components"

import FlexWrapper from "../styled/flex-wrapper"

interface Props {
  closeProductDetailsModal: () => any,
  product: ShopifyProduct
}

export default class ProductDetails extends React.Component<Props> {
  public render() {
    const {
      closeProductDetailsModal,
      product,
    } = this.props

    const {
      body_html,
      image: {src},
      product_type,
      title,
    } = product

    return (
      <div>
        <Header>
          <FlexWrapper>
            <Xbutton onClick={closeProductDetailsModal}>X</Xbutton>
            <ProductType>{product_type.toUpperCase()}</ProductType>
            <div style={{width: "20%"}}>&nbsp;</div>
          </FlexWrapper>
        </Header>

        <DetailsWrapper>
          <img src={src} />
          <Title>{title.toUpperCase()}</Title>
          <div dangerouslySetInnerHTML={{__html: body_html}} />
        </DetailsWrapper>
      </div>
    )
  }
}

const DetailsWrapper = styled.div`
  padding: 20px 30px;
  text-align: center;
`

const Header = styled.div`
  box-shadow: 0 0px 15px 1px #000;
  padding: 10px 0;
`

const ProductType = styled.h2`
  font-size: 120%;
  letter-spacing: 2px;
  margin: 0;
`

const Title = styled.h2`
  font-size: 160%;
  letter-spacing: 2px;
  margin: 15px 0;
`

const Xbutton = styled.a.attrs({
  href: "javascript:void(0)",
})`
  color: #fff;
  font-size: 140%;
  letter-spacing: 1px;
  padding: 10px 20px;
  width: 20%;
`

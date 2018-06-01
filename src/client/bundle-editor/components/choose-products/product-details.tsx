import * as React from "react"
import styled from "styled-components"

import {productTitleWithoutType} from "../../../../shared/helpers"
import FlexWrapper from "../styled/flex-wrapper"
import ProductSubdetail from "./product-subdetail"

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
      images,
      product_type,
      title,
    } = product

    const nutritionFactsImage = images.find(({alt}) => /nutrition facts/i.test(alt))

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
          <Title>{productTitleWithoutType(title, product_type)}</Title>
          <p dangerouslySetInnerHTML={{__html: body_html}} />

          <hr />
          <ProductSubdetail
            content={this.subdetailContent("Benefits")}
            title="BENEFITS"
          />
          <hr />

          <ProductSubdetail
            content={this.subdetailContent("Ingredients")}
            title="INGREDIENTS"
          />
          <hr />

          {nutritionFactsImage && <img src={nutritionFactsImage.src} />}

        </DetailsWrapper>
      </div>
    )
  }

  private subdetailContent = (title) => (
    this.props.product.tags
      .split(", ")
      .filter((tag) => tag.startsWith(`${title} - `))
      .map((tag) => (
        <Subdetail key={tag}>
          {tag.replace(new RegExp(`${title} \- `), "")}
        </Subdetail>
      ))
  )
}

const DetailsWrapper = styled.div`
  padding: 20px 30px 100px;
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

const Subdetail = styled.span`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  display: inline-block;
  font-size: 80%;
  margin: 3px 6px 3px 0;
  padding: 4px 8px;
  text-transform: uppercase;
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

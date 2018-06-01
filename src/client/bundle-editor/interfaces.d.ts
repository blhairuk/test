declare interface ShopifyCollection {
  body_html: string,
  image: {
    src: string,
  },
  title: string,
}

declare interface ShopifyProduct {
  body_html: string,
  id: number,
  image: {
    src: string,
  },
  images: Array<{
    alt: string,
    src: string,
  }>,
  product_type: string,
  tags: string,
  title: string,
  variants: ShopifyVariant[],
}

declare interface ShopifyProductMetafield {
  key: string,
  namespace: string,
  value: string,
}

declare interface ShopifyVariant {
  id: number,
  price: string,
  product_id: number,
  option1: string,
}

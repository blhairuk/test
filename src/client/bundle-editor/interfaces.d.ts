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
    src: string,
  }>,
  product_type: string,
  tags: string,
  title: string,
  variants: ShopifyVariant[],
}

declare interface ShopifyVariant {
  id: number,
  price: string,
  option1: string,
}

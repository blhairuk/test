declare interface ShopifyCollection {
  body_html: string,
  image: {
    src: string
  },
  title: string,
}

declare interface ShopifyProduct {
  id: number,
  image: {
    src: string,
  },
  images: {
    src: string,
  }[],
  tags: string,
  title: string,
  variants: ShopifyVariant[],
}

declare interface ShopifyVariant {
  id: number,
  price: string,
  option1: string,
}
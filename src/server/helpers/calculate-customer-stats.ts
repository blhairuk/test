interface Props {
  orders: ShopifyOrder[],
  products: ShopifyProduct[],
}

interface Returned {
  foodLbsSaved: number,
  buyingMinsSaved: number,
  preppingMinsSaved: number,
}

export default ({orders, products}: Props): Returned => {
  let foodLbsSaved = 0
  let buyingMinsSaved = 0
  let preppingMinsSaved = 0

  for (const order of orders) {
    for (const {product_id, quantity} of order.line_items) {
      const product = products.find(({id}) => id === product_id)
      if (product) {
        if (product.product_type === "Smoothie") {
          foodLbsSaved += 0.1 * quantity
          buyingMinsSaved += 0.1 * quantity
          preppingMinsSaved += 0.1 * quantity
        } else if (product.product_type === "Acai Bowl") {
          foodLbsSaved += 0.2 * quantity
          buyingMinsSaved += 0.2 * quantity
          preppingMinsSaved += 0.2 * quantity
        } else if (product.product_type === "Overnight Oats") {
          foodLbsSaved += 0.3 * quantity
          buyingMinsSaved += 0.3 * quantity
          preppingMinsSaved += 0.3 * quantity
        }
      }
    }
  }

  return {foodLbsSaved, buyingMinsSaved, preppingMinsSaved}
}

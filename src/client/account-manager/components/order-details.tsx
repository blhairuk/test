import {formatMoney} from "accounting"
import {format as formatDate} from "date-fns"
import * as React from "react"

export interface Props {
  order: ShopifyOrder,
}

export default class OrderDetails extends React.Component<Props> {
  public render() {
    const {
      order: {
        created_at,
        discount_codes,
        line_items,
        name,
        shipping_lines,
        subtotal_price,
        total_price,
      },
    } = this.props

    return (
      <div>
        <h2>Order {name}</h2>

        <h4>{formatDate(created_at, "MMM D, YYYY h:mA")}</h4>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th className="text-center">Quantity</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {line_items.map(({id, price: priceS, quantity, sku, title}) => {
              const price = parseFloat(priceS)
              return (
                <tr key={id}>
                  <td>{title}</td>
                  <td>{sku}</td>
                  <td>{formatMoney(price)}</td>
                  <td className="text-center">{quantity}</td>
                  <td className="text-right">{formatMoney(price * quantity)}</td>
                </tr>
              )
            })}
            <tr>
              <th colSpan={4}>Subtotal</th>
              <th className="text-right">{formatMoney(subtotal_price)}</th>
            </tr>
            {discount_codes.map(({amount, code}) => (
              <tr key={code}>
                <th colSpan={4}>{code} discount</th>
                <th className="text-right">{formatMoney(parseFloat(amount) * -1)}</th>
              </tr>
            ))}
            {shipping_lines.map(({id, price, title}) => (
              <tr key={id}>
                <th colSpan={4}>{title}</th>
                <th className="text-right">{formatMoney(parseFloat(price) * -1)}</th>
              </tr>
            ))}
            <tr>
              <th colSpan={4}>Total</th>
              <th className="text-right">{formatMoney(parseFloat(total_price))}</th>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

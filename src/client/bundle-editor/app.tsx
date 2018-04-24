import * as React from 'react'

interface IProps {
  collection: Object,
  product: Object,
  productMetafields: Object,
  products: [{
    id: number,
    title: string
  }]
}

export default class App extends React.Component<IProps> {
  render () {
    return (
      <div>
        {this.props.products.map(product => (
          <div key={product.id}>
            {product.title}
          </div>
        ))}
      </div>
    )
  }
}
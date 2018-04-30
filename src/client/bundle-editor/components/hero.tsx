import * as React from 'react'

interface Props {
  product: ShopifyProduct
}

export default class Hero extends React.Component<Props> {
  render () {
    const {
      product: {
        body_html,
        image: {src},
        title,
      }
    } = this.props

    return (
      <div>
        <img src={src} />
        <h1 className='section-header__title h2'>{title}</h1>
        {body_html && (
          <div className='section-header__description rte'>
            {body_html}
          </div>
        )}
      </div>
    )
  }
}
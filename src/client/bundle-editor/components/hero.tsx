import * as React from 'react'

interface Props {
  collection: ShopifyCollection
}

export default class Hero extends React.Component<Props> {
  render () {
    const {collection} = this.props

    return (
      <div>
        <img src={collection.image.src} />
        <h1 className='section-header__title h2'>{collection.title}</h1>
        {collection.body_html && (
          <div className='section-header__description rte'>
            {collection.body_html}
          </div>
        )}
      </div>
    )
  }
}
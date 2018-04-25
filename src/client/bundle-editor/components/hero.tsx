import * as React from 'react'

import {ICollection} from '../app'

interface IProps {
  collection: ICollection
}

export default class Hero extends React.Component<IProps> {
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
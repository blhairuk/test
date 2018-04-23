import * as Knex from 'knex'

import * as knexfile from '../knexfile'

const knex = Knex(knexfile)

export const getToken = async shop => {
  const row = 
    await knex('shops')
    .where({shop})
    .first('token')

  return row.token
}

export const saveToken = async ({
  shop, 
  token
}) => (
  knex('shops').insert({
    shop, 
    token
  })
)
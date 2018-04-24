import * as Knex from 'knex'

import * as knexfile from '../../knexfile'

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
}) => {
  const exists = 
    !!(await knex('shops')
    .where({shop})
    .first('shop'))

  if (exists) {
    return knex('shops')
      .where({shop})
      .update({token})
  }

  return knex('shops').insert({
    shop, 
    token
  })
}
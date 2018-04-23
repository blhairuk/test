module.exports = {
  up: knex => (
    knex.schema.createTable('shops', table => {
      table.string('shop')
      table.string('token')
      table.unique('shop')
    })
  ),

  down: knex => (
    knex.schema.dropTableIfExists('shops')
  )
}
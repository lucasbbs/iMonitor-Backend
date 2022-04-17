export async function up(knex) {
  return knex.schema.createTable('classes', (table) => {
    table.increments('id').primary();
    table.decimal('cost').notNullable();

    table
      .integer('subject_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex) {
  return knex.schema.dropTable('classes');
}

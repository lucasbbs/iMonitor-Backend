export async function up(knex) {
  return knex.schema.createTable('subjects', (table) => {
    table.increments('id').primary();
    table.string('subject').notNullable();
  });
}

export async function down(knex) {
  return knex.schema.dropTable('subjects');
}

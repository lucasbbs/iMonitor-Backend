"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
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
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('classes');
}
exports.down = down;

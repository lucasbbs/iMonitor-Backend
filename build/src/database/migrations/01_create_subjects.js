"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('subjects', (table) => {
        table.increments('id').primary();
        table.string('subject').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('subjects');
}
exports.down = down;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
            table.enu('role', ['admin', 'maestro']).notNullable();
        })
        .createTable('pdf_files', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable(); 
            table.binary('file').notNullable();
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('pdf_files')
        .dropTable('users');
};
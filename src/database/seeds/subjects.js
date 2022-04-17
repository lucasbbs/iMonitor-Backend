"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const seed = async (knex) => {
    await knex('subjects').del();
    await knex('subjects').insert([
        {
            subject: 'Cálculo 1',
        },
        {
            subject: 'Cálculo 2',
        },
        {
            subject: 'Cálculo 3',
        },
        {
            subject: 'Física 1',
        },
        {
            subject: 'Física 2',
        },
        {
            subject: 'Física 3',
        },
        {
            subject: 'Álgebra Linear',
        },
        {
            subject: 'Algoritmos e Programação de Computadores',
        },
    ]);
};
exports.seed = seed;

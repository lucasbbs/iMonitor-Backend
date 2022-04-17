"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.seed = async (knex) => {
    await knex('users').del();
    await knex('users').insert([
        {
            name: "Lucas Breno de Souza Noronha Braga",
            avatar: "https://github.com/lucasbbs.png",
            whatsapp: "5561983499994",
            bio: "Eu sou um estudante do curso de Computação da UnB, posso te ajudar com Cálculo e Física",
            email: 'lucasbbs@live.fr',
            password: bcryptjs_1.default.hashSync('123456', 10)
        }
    ]);
};

import Knex from 'knex';
import brcyptjs from 'bcryptjs'

export const seed = async (knex: Knex) => {

  await knex('users').del()

  await knex('users').insert([
    {
      name: "Lucas Breno de Souza Noronha Braga",
      avatar: "https://github.com/lucasbbs.png",
      whatsapp: "5561983499994",
      bio: "Eu sou um estudante do curso de Computação da UnB, posso te ajudar com Cálculo e Física",
      email: 'lucasbbs@live.fr',
      password: brcyptjs.hashSync('123456', 10)
    }
  ]);
};
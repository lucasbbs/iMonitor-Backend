const path = require('path');
require('dotenv').config();

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tablename: 'knex_migrations',
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  // useNullAsDefault: true,
};

// module.exports = {
//   client: 'sqlite3',
//   connection: {
//     filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
//   },
//   migrations: {
//     directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
//   },
//   seeds: {
//     directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
//   },
//   useNullAsDefault: true,
// };

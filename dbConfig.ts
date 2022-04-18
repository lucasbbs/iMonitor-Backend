const dbEngine = process.env.DB_ENVIRONMENT || 'development';
import config from './knexfile';
const dbconfig = config[dbEngine];

module.exports = require('knex')(dbconfig);

const { Client } = require('pg');

const client = new Client({
  user: 'Alan',
  host: 'localhost',
  database: 'relatedItem',
  password: 'alanfu1337',
  port: 5432,
});
client.connect();

const getRelated = (id, callback) => {
  client.query(`SELECT * FROM relateditems WHERE id = ${id}`, callback);
  // query with productName
};

module.exports = { getRelated };

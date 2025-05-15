const { Client } = require('pg');

const client = new Client({
  host: 'postgres',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'almacencito',
});

client.connect()
  .then(() => {
    console.log('Conexión exitosa a Postgres!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Hora actual en Postgres:', res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('Error de conexión:', err);
    client.end();
  });

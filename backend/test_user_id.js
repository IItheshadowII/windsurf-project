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
    return client.query('SELECT id FROM users WHERE email = $1', ['testuser@example.com']);
  })
  .then(res => {
    console.log('ID del usuario:', res.rows[0]?.id);
    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });

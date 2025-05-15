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
    return client.query('UPDATE users SET is_active = true WHERE email = $1', ['testuser@example.com']);
  })
  .then(res => {
    console.log('Usuario activado:', res.rowCount);
    return client.query('SELECT email, is_active FROM users WHERE email = $1', ['testuser@example.com']);
  })
  .then(res => {
    console.log('Estado actual del usuario:', res.rows);
    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });

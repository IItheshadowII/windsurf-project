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
    return client.query('SELECT password FROM users WHERE email = $1', ['testuser@example.com']);
  })
  .then(res => {
    console.log('Contraseña almacenada:', res.rows[0]?.password);
    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });

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
    return client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
  })
  .then(res => {
    console.log('Estructura de la tabla users:', res.rows);
    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });

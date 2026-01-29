// db.js
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para poder usar async/await
require('dotenv').config(); // Cargar variables de entorno

// Crear el pool de conexiones
// Un "pool" es una lista de conexiones reutilizables. Es más eficiente que abrir y cerrar una conexión por cada petición.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Máximo 10 conexiones simultáneas
    queueLimit: 0
});

// Probamos la conexión al iniciar
pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('✅ Base de datos conectada exitosamente');
    })
    .catch(err => {
        console.error('❌ Error conectando a la base de datos:', err.message);
    });

module.exports = pool;
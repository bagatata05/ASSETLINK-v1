import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

async function checkDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || undefined,
        database: process.env.DB_NAME || 'assetlink',
        port: parseInt(process.env.DB_PORT || '3306', 10),
    });

    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables:', rows);

    for (const row of rows) {
        const tableName = Object.values(row)[0];
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`Table ${tableName}:`, columns);
    }

    await connection.end();
}

checkDb().catch(console.error);

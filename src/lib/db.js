import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export async function getPool() {
	if (!pool) {
		const config = {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		};

		pool = mysql.createPool(config);
	}
	return pool;
}

export async function query(sql, values) {
	const connection = await getPool();
	const [rows] = await connection.execute(sql, values);
	return rows;
}

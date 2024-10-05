import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema'; // Aquí irán tus modelos definidos

// Conexión a la base de datos SQLite
const sqlite = new Database('data/liveness.db'); // Asegúrate de que esta ruta sea correcta
export const db = drizzle(sqlite, { schema });

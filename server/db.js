import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In a real Electron app, we would get this from the Main process via IPC or env
const storagePath = process.env.DATA_STORAGE_PATH;
const appDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share');
const defaultPath = path.join(appDataDir, 'nandkishor-wholesale');

const baseDir = (storagePath && fs.existsSync(storagePath)) ? storagePath : defaultPath;

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
}

const dbPath = path.join(baseDir, 'nandkishor.db');
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    _id TEXT UNIQUE, -- To maintain compatibility with MongoDB style IDs if needed
    name TEXT NOT NULL,
    category TEXT,
    subcategory TEXT,
    autoId TEXT UNIQUE,
    customCode TEXT,
    gender TEXT,
    fabric TEXT,
    colors TEXT, -- JSON string
    sizePricings TEXT, -- JSON string
    images TEXT, -- JSON string
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log(`✅ SQLite Database initialized at: ${dbPath}`);

export default db;

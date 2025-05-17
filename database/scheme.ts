import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
    const db = await SQLite.openDatabaseAsync("database.db");    

    await db.withTransactionAsync(async () => {
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS markers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );`
        );
        await db.runAsync(
            `CREATE TABLE IF NOT EXISTS marker_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                marker_id INTEGER NOT NULL,
                uri TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (marker_id) REFERENCES markers(id) ON DELETE CASCADE
            );`
        );
    });

    await db.execAsync("PRAGMA foreign_keys = ON;")

    return db;
}
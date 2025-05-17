import { MarkerData, MarkerImage } from "../types";
// import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from "expo-sqlite";

export const addMarker = async (
    db: SQLiteDatabase,
    latitude: number,
    longitude: number
): Promise<number> => {
    const { lastInsertRowId } = await db.runAsync(
        "insert into markers (latitude, longitude) values (?, ?);",
        latitude,
        longitude
    );

    return lastInsertRowId;
};

export const deleteMarker = async (
    db: SQLiteDatabase,
    markerId: number
): Promise<void> => {
    await db.runAsync("delete from markers where id = ?;", markerId);
};

export const getMarkers = async (
    db: SQLiteDatabase
): Promise<MarkerData[]> => {
    const rows = await db.getAllAsync<
        { id: number; latitude: number; longitude: number }
    >("select id, latitude, longitude from markers;");

    return rows.map(r => ({
        id: r.id.toString(),
        coordinate: { latitude: r.latitude, longitude: r.longitude },
        images: [],
    }));
};

export const addImage = (
    db: SQLiteDatabase,
    markerId: number,
    uri: string
) => db.runAsync(
    "insert into marker_images (marker_id, uri) values (?, ?);",
    markerId,
    uri
);

export const deleteImage = (
    db: SQLiteDatabase,
    imageId: number
) => db.runAsync(
    "delete from marker_images where id = ?;",
    imageId
);

export const getMarkerImages = (
    db: SQLiteDatabase,
    markerId: number
): Promise<MarkerImage[]> => db.getAllAsync<MarkerImage>(
    "select id, uri from marker_images where marker_id = ?;",
    markerId
);
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MarkerData, MarkerImage } from '../types';
import type { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { initDatabase } from '../database/scheme';
import {
    addMarker,
    deleteMarker,
    getMarkers,
    addImage,
    deleteImage,
    getMarkerImages,
} from '../database/operations';

interface DatabaseContextType {
    markers: MarkerData[];
    refreshMarkers: () => Promise<void>;

    addMarkerOP: (lat: number, lng: number) => Promise<void>;
    deleteMarkerOP: (id: string) => Promise<void>;

    addImageOP: (markerId: string, uri: string) => Promise<void> | Promise<SQLiteRunResult>;
    deleteImageOP: (imageId: number, markerId: string) => Promise<void> | Promise<SQLiteRunResult>;
    getMarkerImagesOP: (markerId: string) => Promise<MarkerImage[]>;

    isLoading: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);
export const useDatabase = () => {
    const ctx = useContext(DatabaseContext);
    if (!ctx) throw new Error("useDatabase must be used within DatabaseProvider");
    return ctx;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const database = await initDatabase();
                if (!mounted) return;
                setDb(database);
                const all_markers = await getMarkers(database);
                setMarkers(all_markers);
            } catch (e) {
                if (mounted) setError(e as Error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => {
            mounted = false;
            db?.closeAsync?.();
        };
    }, []);

    const refreshMarkers = useCallback(async () => {
        if (db) {
            const all_markers = await getMarkers(db);
            setMarkers(all_markers);
        }
    }, [db]);

    const addMarkerOP = async (latitude: number, longitude: number) => {
        if (!db) return;
        const id = await addMarker(db, latitude, longitude);
        setMarkers(prev => [...prev, { id: id.toString(), coordinate: { latitude: latitude, longitude: longitude }, images: [] }]);
    };

    const deleteMarkerOP = async (id: string) => {
        if (!db) return;
        await deleteMarker(db, Number(id));
        setMarkers(prev => prev.filter(m => m.id !== id));
    };

    const addImageOP = (markerId: string, uri: string) => db ? addImage(db, Number(markerId), uri) : Promise.resolve();

    const deleteImageOP = (imageId: number, markerId: string) => db ? deleteImage(db, imageId) : Promise.resolve();

    const getMarkerImagesOP = (markerId: string) => db ? getMarkerImages(db, Number(markerId)) : Promise.resolve([]);

    const value: DatabaseContextType = {
        markers,
        refreshMarkers,
        addMarkerOP,
        deleteMarkerOP,
        addImageOP,
        deleteImageOP,
        getMarkerImagesOP,
        isLoading,
        error,
    };

    return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};
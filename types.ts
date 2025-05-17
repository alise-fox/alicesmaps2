export interface MarkerImage {
    id: number,
    uri: string;
}

export interface MarkerData {
    id: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    images: MarkerImage[];
}

export type RootStackParamList = {
    index: undefined;
    'marker/[id]': { id: string };
};
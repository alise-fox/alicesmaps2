// import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Map from '../components/Map';
import { useDatabase } from '../context/DatabaseContext';
// import { useMarkers } from '../context/MarkersContext';
// import { MarkerData } from '../types';

export default function HomeScreen() {
    // const [markers, addMarkers] = useState<MarkerData[]>([]);
    //   const { markers, addMarker } = useMarkers();
    const { 
        markers, 
        addMarkerOP, 
        isLoading,
        error
    } = useDatabase();

    if (isLoading) return <ActivityIndicator style={{ flex: 1}} />;
    if (error) return <Text style={{ padding: 16, color: "red" }}>{error.message}</Text>;

    return (
        <View style={styles.container}>
            <Map markers={markers} onAddMarker={({latitude, longitude}) => addMarkerOP(latitude, longitude)} />
        </View>
    )

    // const handleAddMarker = (coordinate: { latitude: number; longitude: number }) => {
    //     const newMarker: MarkerData = {
    //         id: Date.now().toString(),
    //         coordinate,
    //         images: [],
    //     };
    //     addMarker(newMarker);
    // };

    // return (
    //     <View style={styles.container}>
    //         <Map markers={markers} onAddMarker={handleAddMarker} />
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
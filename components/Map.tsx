import MapView, { Marker, MapPressEvent, LatLng } from 'react-native-maps';
import { MarkerData } from '../types';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
    markers: MarkerData[];
    onAddMarker: (coordinate: LatLng) => void;
}

export default function Map({ markers, onAddMarker }: Props) {
    const router = useRouter();

    const handleLongPress = (event: MapPressEvent) => {
        console.log("press", event.nativeEvent.coordinate);
        onAddMarker(event.nativeEvent.coordinate);
        console.log(markers);
    };

    return (
        <MapView style={styles.map} onLongPress={handleLongPress}>
            {markers.map(marker => (
                <Marker
                    key={marker.id}
                    coordinate={marker.coordinate}
                    onPress={() => router.push(`/marker/${marker.id}`)}
                />
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});
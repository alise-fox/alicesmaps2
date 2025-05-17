import { View, Text, TouchableOpacity } from 'react-native';
import { MarkerData } from '../types';

interface Props {
  markers: MarkerData[];
  onSelect: (id: string) => void;
}

export default function MarkerList({ markers, onSelect }: Props) {
  return (
    <View>
      {markers.map(marker => (
        <TouchableOpacity key={marker.id} onPress={() => onSelect(marker.id)}>
          <Text>📍 {marker.coordinate.latitude.toFixed(4)}, {marker.coordinate.longitude.toFixed(4)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
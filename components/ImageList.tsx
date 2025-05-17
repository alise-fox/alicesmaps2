import { FlatList, Image, View, Button, StyleSheet } from 'react-native';
import { MarkerImage } from '../types';

interface Props {
  images: MarkerImage[];
  onDelete: (imageId: number) => void;
}

export default function ImageList({ images, onDelete }: Props) {
  return (
    <FlatList
      data={images}
      keyExtractor={item => item.uri}
      horizontal
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <Button title="✕" onPress={() => onDelete(item.id)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
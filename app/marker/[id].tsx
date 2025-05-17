import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useDatabase } from '../../context/DatabaseContext';
import ImageList from '../../components/ImageList';
import { MarkerImage } from '../../types';

export default function MarkerDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const {
        markers,
        getMarkerImagesOP,
        addImageOP,
        deleteImageOP,
        deleteMarkerOP
    } = useDatabase();

    const marker = markers.find(m => m.id === id);
    const [images, setImages] = useState<MarkerImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const imgs = await getMarkerImagesOP(id);
                setImages(imgs);
            } catch (e) {
                Alert.alert('Ошибка', (e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleAddImage = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
            if (!res.canceled && res.assets.length > 0) {
                await addImageOP(id, res.assets[0].uri);
                setImages(await getMarkerImagesOP(id));
            }
        } catch {
            Alert.alert('Ошибка', 'Не удалось выбрать изображение');
        }
    };

    const handleDeleteImage = async (imgId: number) => {
        await deleteImageOP(imgId, id);
        setImages(await getMarkerImagesOP(id));
    };

    const handleRemoveMarker = async () => {
        if (isDeleting) return;
        Alert.alert('Удалить маркер', 'Действительно удалить этот маркер и все его изображения?', [
            { text: 'Отмена', style: 'cancel' },
            {
                text: 'Удалить', style: 'destructive', onPress: async () => {
                    try {
                        setIsDeleting(true);
                        await deleteMarkerOP(id!);
                        router.back();
                    } catch (e) {
                        Alert.alert('Ошибка удаления', (e as Error).message);
                    } finally {
                        setIsDeleting(false);
                    }
                },
            },
        ]);
    };

    if (!marker) return <Text style={{ padding: 16 }}>Маркер не найден</Text>;
    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Координаты:</Text>
            <Text style={styles.coords}>
                {marker.coordinate.latitude}, {marker.coordinate.longitude}
            </Text>
            <Button title="Добавить изображение" onPress={handleAddImage} />
            <ImageList images={images} onDelete={handleDeleteImage} />
            <View style={{ marginTop: 16 }}>
                <Button title="🗑️ Удалить маркер" color="#d9534f" onPress={handleRemoveMarker} />
            </View>
            <Button title="Назад к карте" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    coords: {
        marginBottom: 16,
    },
});
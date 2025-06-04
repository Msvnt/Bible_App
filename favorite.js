import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Platform, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';

//  Tela de Favoritos
function FavoritesScreen({
  theme,
  dark,
  fontSize = 'média',
  fontSizeMap = { pequena: 15, média: 19, grande: 23 }
}) {
  const [favorites, setFavorites] = useState([]);
  const slideAnims = useRef({}); // Usando objeto para FlatList

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  // Inicializa animações para cada favorito
  useEffect(() => {
    const anims = {};
    favorites.forEach((f) => {
      const key = typeof f === 'string' ? f : String(f);
      anims[key] = new Animated.Value(0);
    });
    slideAnims.current = anims;
  }, [favorites]);

  const removeFavorite = async (item) => {
    const key = typeof item === 'string' ? item : String(item);
    Animated.timing(slideAnims.current[key], {
      toValue: -400, // desliza 400px para a esquerda
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      try {
        const updated = favorites.filter(f => f !== item);
        await AsyncStorage.setItem('favorites', JSON.stringify(updated));
        setFavorites(updated);

        // Feedback visual
        if (Platform.OS === 'android') {
          ToastAndroid.show('Favorito removido!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Favorito', 'Favorito removido com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao remover favorito:', error);
      }
    });
  };

  const renderItem = ({ item }) => {
    const key = typeof item === 'string' ? item : String(item);
    return (
      <Animated.View
        style={{
          transform: [{ translateX: slideAnims.current[key] || 0 }],
        }}
      >
        <TouchableOpacity
          accessibilityLabel={`Favorito: ${item}`}
          accessibilityRole="button"
          onLongPress={() => {
            Alert.alert(
              'Remover Favorito',
              'Deseja remover este versículo dos favoritos?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', onPress: () => removeFavorite(item), style: 'destructive' }
              ]
            );
          }}
          style={[styles.favoriteItem, { borderBottomColor: theme.border }]}
        >
          <Text style={{ color: theme.text, fontSize: fontSizeMap[fontSize] }}>
            • {item}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.subtitle, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>⭐ FAVORITOS</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={item => typeof item === 'string' ? item : String(item)}
          renderItem={renderItem}
        />
      ) : (
        <Text style={{ color: dark ? '#aaa' : '#666', fontSize: fontSizeMap[fontSize], textAlign: 'center' }}>
          Nenhum versículo favoritado ainda. Pressione e segure um versículo na tela da Bíblia para adicionar aos favoritos.
        </Text>
      )}
    </View>
  );
}

export default FavoritesScreen;
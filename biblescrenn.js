import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BOOKS, BOOKS_WITH_CHAPTERS } from './constants';
import SelectionModal from './components';
import { styles } from './styles';

//  Bíblia com leitura online
function BibleScreen({ theme, dark, fontSize, fontSizeMap }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [verses, setVerses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [bookModal, setBookModal] = useState(false);
  const [chapterModal, setChapterModal] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    loadFavorites();
    loadLastRead();
  }, []);

  useEffect(() => {
    // Scroll para o topo ao trocar capítulo
    if (scrollRef.current) scrollRef.current.scrollTo({ y: 0, animated: true });
  }, [selectedChapter]);

  const loadFavorites = async () => {
    const saved = await AsyncStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  };

  const loadLastRead = async () => {
    try {
      const lastRead = await AsyncStorage.getItem('lastRead');
      if (lastRead) {
        const { book, chapter } = JSON.parse(lastRead);
        setSelectedBook(book);
        setSelectedChapter(chapter);
        fetchVerses(book, chapter);
      }
    } catch (error) {
      console.error('Erro ao carregar última leitura:', error);
    }
  };

  const saveLastRead = async () => {
    if (selectedBook && selectedChapter) {
      try {
        await AsyncStorage.setItem(
          'lastRead',
          JSON.stringify({
            book: selectedBook,
            chapter: selectedChapter,
          })
        );
      } catch (error) {
        console.error('Erro ao salvar última leitura:', error);
      }
    }
  };

  const fetchVerses = async (
    book = selectedBook,
    chapter = selectedChapter
  ) => {
    if (!book || !chapter) return;

    try {
      const res = await fetch(
        `https://bible-api.com/${encodeURIComponent(
          book + ' ' + chapter
        )}?translation=almeida`
      );
      const data = await res.json();
      setVerses(data.verses || []);
      saveLastRead();
    } catch {
      Alert.alert('Erro', 'Falha ao carregar os versículos.');
    }
  };

  const saveFavorite = async (text) => {
    try {
      const saved = await AsyncStorage.getItem('favorites');
      const parsed = saved ? JSON.parse(saved) : [];
      if (!parsed.includes(text)) {
        const updated = [...parsed, text];
        await AsyncStorage.setItem('favorites', JSON.stringify(updated));
        setFavorites(updated);
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            'Versículo adicionado aos favoritos!',
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert('Favorito', 'Versículo adicionado aos favoritos!');
        }
      } else {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            'Versículo já está nos favoritos',
            ToastAndroid.SHORT
          );
        } else {
          Alert.alert('Favorito', 'Este versículo já está nos favoritos.');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
      Alert.alert('Erro', 'Não foi possível salvar o favorito.');
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setVerses([]);
    setBookModal(false);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setChapterModal(false);
    fetchVerses(selectedBook, chapter);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text
        style={[
          styles.subtitle,
          { color: theme.text, fontSize: fontSizeMap[fontSize] },
        ]}>
        📖 LEIA A BÍBLIA
      </Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => setBookModal(true)}
          style={[styles.selectionButton, { backgroundColor: theme.primary }]}
          accessibilityLabel="Selecionar livro"
          accessibilityRole="button">
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: fontSizeMap[fontSize],
            }}>
            {selectedBook || 'Selecionar Livro'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectedBook && setChapterModal(true)}
          style={[styles.selectionButton, { backgroundColor: theme.primary }]}
          accessibilityLabel="Selecionar capítulo"
          accessibilityRole="button">
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: fontSizeMap[fontSize],
            }}>
            {selectedChapter
              ? `Capítulo ${selectedChapter}`
              : 'Selecionar Capítulo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modais refatorados como componentes */}
      <SelectionModal
        visible={bookModal}
        items={BOOKS}
        onSelect={handleBookSelect}
        onClose={() => setBookModal(false)}
        selectedItem={selectedBook}
        theme={theme}
      />

      <SelectionModal
        visible={chapterModal}
        items={[...Array(BOOKS_WITH_CHAPTERS[selectedBook] || 0)].map(
          (_, i) => `Capítulo ${i + 1}`
        )}
        onSelect={(item) => handleChapterSelect(item.replace('Capítulo ', ''))}
        onClose={() => setChapterModal(false)}
        selectedItem={selectedChapter ? `Capítulo ${selectedChapter}` : null}
        theme={theme}
      />

      {verses.length > 0 ? (
        <View
          style={[styles.card, { backgroundColor: theme.card, marginTop: 20 }]}>
          <Text
            style={[
              styles.subtitle,
              { color: theme.text, fontSize: fontSizeMap[fontSize] },
            ]}>
            📘 {selectedBook} {selectedChapter}
          </Text>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {verses.map((v) => (
              <TouchableOpacity
                key={`${v.book_name}-${v.chapter}-${v.verse}`}
                onLongPress={() =>
                  saveFavorite(
                    `${v.book_name} ${v.chapter}:${v.verse} - ${v.text}`
                  )
                }
                accessibilityLabel={`Versículo ${v.verse}. ${v.text}`}
                accessibilityRole="button"
                style={[
                  styles.verseContainer,
                  { borderBottomColor: theme.border },
                ]}>
                <Text
                  style={{
                    color: theme.text,
                    marginBottom: 6,
                    fontSize: fontSizeMap[fontSize],
                  }}>
                  <Text style={{ fontWeight: 'bold' }}>{v.verse}.</Text>{' '}
                  {v.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <Text
          style={{
            color: theme.text,
            fontSize: fontSizeMap[fontSize],
            marginTop: 20,
          }}>
          {selectedBook && selectedChapter
            ? 'Nenhum versículo encontrado para este capítulo.'
            : 'Selecione um livro e capítulo para começar a leitura.'}
        </Text>
      )}
    </View>
  );
}

export default BibleScreen;

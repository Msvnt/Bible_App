import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação dos componentes separados
import BibleScreen from './biblescrenn';
import PlanScreen from './planscreen';
import FavoritesScreen from './favorite';
import SettingsScreen from './SettingsScreen';
import { styles } from './styles';
import { BOOKS_WITH_CHAPTERS, BOOKS, DAYS } from './constants'; 

const fontSizeMap = { pequena: 15, média: 19, grande: 23 };

export default function App() {
  const [dark, setDark] = useState(false);
  const [currentTab, setCurrentTab] = useState('bible');
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('média');

  // Função memoizada para evitar redefinição a cada render
  const loadPreferences = useCallback(async () => {
    try {
      const preferences = await AsyncStorage.getItem('preferences');
      if (preferences) {
        const { darkMode, lastTab } = JSON.parse(preferences);
        setDark(!!darkMode);
        if (lastTab) setCurrentTab(lastTab);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar preferências.');
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva preferências apenas quando dark ou currentTab mudam
  const savePreferences = useCallback(async () => {
    try {
      await AsyncStorage.setItem('preferences', JSON.stringify({
        darkMode: dark,
        lastTab: currentTab
      }));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar preferências.');
      console.error('Erro ao salvar preferências:', error);
    }
  }, [dark, currentTab]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (!loading) savePreferences();
  }, [dark, currentTab, savePreferences, loading]);

  useEffect(() => {
    AsyncStorage.getItem('fontSize').then(value => {
      if (value) setFontSize(value);
    });
  }, []);

  const setAndSaveFontSize = (size) => {
    setFontSize(size);
    AsyncStorage.setItem('fontSize', size);
  };

  const theme = {
    bg: dark ? '#0D0D0D' : '#FAFAFA',
    text: dark ? '#F5F5F5' : '#333333',
    card: dark ? '#1A1A1A' : '#FFFFFF',
    border: dark ? '#2C2C2C' : '#E0E0E0',
    primary: '#34D399',
  };

  const changeTheme = (isDark) => {
    setDark(isDark);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>Carregando preferências...</Text>
      </SafeAreaView>
    );
  }

  const tabs = [
    { key: 'bible', label: '📖 BÍBLIA' },
    { key: 'planner', label: '📅 PLANNER' },
    { key: 'favorites', label: '⭐ FAVORITOS' },
    { key: 'settings', label: '⚙️ CONFIG' },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.bg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.title, { color: theme.text }]}>
          📖 Vida com Propósito
        </Text>

        {currentTab === 'bible' && <BibleScreen theme={theme} dark={dark} fontSize={fontSize} fontSizeMap={fontSizeMap} />}
        {currentTab === 'planner' && <PlanScreen theme={theme} dark={dark} fontSize={fontSize} fontSizeMap={fontSizeMap} />}
        {currentTab === 'favorites' && <FavoritesScreen theme={theme} dark={dark} />}
        {currentTab === 'settings' && <SettingsScreen theme={theme} dark={dark} onThemeChange={changeTheme} fontSize={fontSize} setAndSaveFontSize={setAndSaveFontSize} fontSizeMap={fontSizeMap} />}
      </ScrollView>

      <View
        style={[
          styles.navbar,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setCurrentTab(tab.key)}
            style={styles.navButton}
            accessibilityLabel={tab.label}
            accessibilityRole="button"
          >
            <Text
              style={{ color: currentTab === tab.key ? theme.primary : '#888' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

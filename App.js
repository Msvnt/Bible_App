import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BibleScreen from './biblescrenn';
import PlanScreen from './planscreen';
import FavoritesScreen from './favorite';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './loginScreen';
import { styles } from './styles';
import { BOOKS_WITH_CHAPTERS, BOOKS, DAYS } from './constants';

// Mapeamento de tamanhos de fonte para valores numéricos
const fontSizeMap = { pequena: 15, média: 19, grande: 23 };

export default function App() {
  // Estados do aplicativo
  const [dark, setDark] = useState(false); // Estado para o modo escuro/claro
  const [currentTab, setCurrentTab] = useState('bible'); // Aba atualmente selecionada
  const [loading, setLoading] = useState(true); // Estado de carregamento inicial
  const [fontSize, setFontSize] = useState('média'); // Tamanho da fonte selecionado

  
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
    } finally {
      setLoading(false); 
    }
  }, []);

  // Callback para salvar as preferências no AsyncStorage
  const savePreferences = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        'preferences',
        JSON.stringify({
          darkMode: dark,
          lastTab: currentTab,
        })
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar preferências.');
    }
  }, [dark, currentTab]); // Dependências para o useCallback

  // Efeito para carregar as preferências quando o componente é montado
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Efeito para salvar as preferências sempre que dark ou currentTab mudarem, após o carregamento inicial
  useEffect(() => {
    if (!loading) {
      savePreferences();
    }
  }, [dark, currentTab, savePreferences, loading]);

  // Efeito para carregar o tamanho da fonte
  useEffect(() => {
    AsyncStorage.getItem('fontSize').then((value) => {
      if (value) {
        setFontSize(value);
      }
    });
  }, []);

  // Função para definir e salvar o tamanho da fonte
  const setAndSaveFontSize = (size) => {
    setFontSize(size);
    AsyncStorage.setItem('fontSize', size);
  };

  // Definição do tema (cores)
  const theme = {
    bg: dark ? '#0D0D0D' : '#FAFAFA', // Cor de fundo principal
    text: dark ? '#F5F5F5' : '#333333', // Cor do texto
    card: dark ? '#1A1A1A' : '#FFFFFF', // Cor de cartões/elementos de fundo
    border: dark ? '#2C2C2C' : '#E0E0E0', // Cor de bordas
    primary: '#34D399', // Cor primária (destaque)
  };

  // Função para mudar o tema
  const changeTheme = (isDark) => {
    setDark(isDark);
  };

  // Definição das abas de navegação
  const tabs = [
    { key: 'bible', label: '📖' },
    { key: 'planner', label: '📅' },
    { key: 'favorites', label: '⭐' },
    { key: 'settings', label: '⚙️' },
  ];

  // Exibe um indicador de carregamento enquanto as preferências são carregadas
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.bg,
        }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>
          Carregando preferências...
        </Text>
      </SafeAreaView>
    );
  }

  // Renderização principal do aplicativo
  return (
    <SafeAreaView
      style={{
        flex: 1, 
        backgroundColor: theme.bg, 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
      }}>
     
      {currentTab === 'login' ? (
        
        <LoginScreen onBack={() => setCurrentTab('settings')} theme={theme} dark={dark} />
      ) : (
        
        <>
          
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            {/* Título principal do aplicativo */}
            <Text style={[styles.title, { color: theme.text }]}>
              📖 Vida com Propósito
            </Text>

           
            {currentTab === 'bible' && (
              <BibleScreen
                theme={theme}
                dark={dark}
                fontSize={fontSize}
                fontSizeMap={fontSizeMap}
              />
            )}
            {currentTab === 'planner' && (
              <PlanScreen
                theme={theme}
                dark={dark}
                fontSize={fontSize}
                fontSizeMap={fontSizeMap}
              />
            )}
            {currentTab === 'favorites' && (
              <FavoritesScreen theme={theme} dark={dark} />
            )}
            {currentTab === 'settings' && (
              <SettingsScreen
                theme={theme}
                dark={dark}
                onThemeChange={changeTheme}
                fontSize={fontSize}
                setAndSaveFontSize={setAndSaveFontSize}
                fontSizeMap={fontSizeMap}
                setCurrentTab={setCurrentTab}
              />
            )}
          </ScrollView>

          {/* Barra de Navegação inferior */}
          <View
            style={[
              styles.navbar,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setCurrentTab(tab.key)}
                style={styles.navButton}>
                <Text
                  style={{
                    color: currentTab === tab.key ? theme.primary : '#888',
                  }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

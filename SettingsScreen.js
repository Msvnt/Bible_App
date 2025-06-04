import React from 'react';
import { Alert, Linking, Switch, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';


function SettingsScreen({ theme, dark, onThemeChange, fontSize, setAndSaveFontSize, fontSizeMap, setCurrentTab }) {

  const clearAllData = async () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados do aplicativo? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Sucesso', 'Todos os dados foram removidos com sucesso.');
            } catch (error) {
              console.error('Erro ao limpar dados:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao tentar limpar os dados.');
            }
          }
        }
      ]
    );
  };

  const exportData = async () => {
    Alert.alert(
      'Exportar Dados',
      'Deseja exportar seus dados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: async () => {
            try {
              Alert.alert('Exportação', 'Função de exportação de dados será implementada em versão futura.');
            } catch (error) {
              console.error('Erro ao exportar dados:', error);
              Alert.alert('Erro', 'Não foi possível exportar os dados.');
            }
          }
        }
      ]
    );
  };

  const openAbout = () => {
    Alert.alert(
      'Sobre o Aplicativo', 
      'Vida com Propósito v1.0\n\nUm aplicativo para leitura da Bíblia, planejamento semanal e organização de versículos favoritos.'
    );
  };

  const contactSupport = () => {
    Linking.openURL('mailto:matheuspsilva91@gmail.com?subject=Suporte%20Vida%20com%20Proposito')
      .catch(() => Alert.alert('Erro', 'Não foi possível abrir o aplicativo de email.'));
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.subtitle, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>⚙️ CONFIGURAÇÕES </Text>
      
      {/* Seção Aparência */}
      <Text style={[styles.sectionHeader, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>Aparência</Text>
      
      <View style={[styles.settingsOption, { borderBottomColor: theme.border }]}>
        <Text
          style={[styles.settingsOptionText, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}
          accessibilityLabel="Alternar modo escuro">Modo Escuro</Text>
        <Switch
          value={dark}
          onValueChange={onThemeChange}
          accessibilityLabel="Alternar modo escuro"
        />
      </View>
      
      <View style={[styles.settingsOption, { borderBottomColor: theme.border }]}>
        <Text
          style={[styles.settingsOptionText, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}
          accessibilityLabel="Selecionar tamanho da fonte">Tamanho da Fonte</Text>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              'Tamanho da Fonte',
              'Selecione o tamanho desejado',
              [
                { text: 'Pequena', onPress: () => setAndSaveFontSize('pequena') },
                { text: 'Média', onPress: () => setAndSaveFontSize('média') },
                { text: 'Grande', onPress: () => setAndSaveFontSize('grande') }
              ]
            );
          }}
          accessibilityLabel="Alterar tamanho da fonte"
          accessibilityRole="button"
        >
          <Text style={{ color: theme.primary, fontSize: fontSizeMap[fontSize] }}>
            {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Seção Dados */}

      <Text style={[styles.sectionHeader, { color: theme.text, marginTop: 20, fontSize: fontSizeMap[fontSize] }]}>Dados</Text>
      
      <TouchableOpacity 
        style={[styles.settingsOption, { borderBottomColor: theme.border }]}
        onPress={exportData}
        accessibilityLabel="Exportar dados"
        accessibilityRole="button"
      >
        <Text style={[styles.settingsOptionText, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>Exportar Dados</Text>
        <Text style={{ color: theme.primary }}>{'>'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.settingsOption, { borderBottomColor: theme.border }]}
        onPress={clearAllData}
        accessibilityLabel="Limpar todos os dados"
        accessibilityRole="button"
      >
        <Text style={[styles.settingsOptionText, { color: '#E53E3E', fontSize: fontSizeMap[fontSize] }]}>Limpar Todos os Dados</Text>
        <Text style={{ color: '#E53E3E' }}>{'>'}</Text>
      </TouchableOpacity>
      
      {/* Seção Sobre */}
      <Text style={[styles.sectionHeader, { color: theme.text, marginTop: 20, fontSize: fontSizeMap[fontSize] }]}>Sobre</Text>
      
      <TouchableOpacity 
        style={[styles.settingsOption, { borderBottomColor: theme.border }]}
        onPress={openAbout}
        accessibilityLabel="Sobre o aplicativo"
        accessibilityRole="button"
      >
        <Text style={[styles.settingsOptionText, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>Sobre o Aplicativo</Text>
        <Text style={{ color: theme.primary }}>{'>'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.settingsOption, { borderBottomColor: theme.border }]}
        onPress={contactSupport}
        accessibilityLabel="Contato e suporte"
        accessibilityRole="button"
      >
        <Text style={[styles.settingsOptionText, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>Contato e Suporte</Text>
        <Text style={{ color: theme.primary }}>{'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsOption}
        onPress={() => setCurrentTab('login')}>
        <Text style={[styles.sectionHeader, { color: theme.text, fontSize: fontSizeMap[fontSize] }]}>Fazer Login</Text>
      </TouchableOpacity>
      
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: dark ? '#666' : '#999', fontSize: 12 }}>Versão 0.0.12</Text>
      </View>
    </View>
  );
}

export default SettingsScreen;
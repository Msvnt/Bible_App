import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from './styles';

export default function LoginScreen({ onBack, theme, dark }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'teste@teste.com' && password === '12345') {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      onBack(); // Volta para a tela anterior (neste caso, SettingsScreen)
    } else {
      Alert.alert('Erro!', 'Email ou senha inválidos!');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: 'center', // Centraliza o conteúdo verticalmente
          alignItems: 'center',    // Centraliza o conteúdo horizontalmente
          backgroundColor: theme.bg, // Usa a cor de fundo do tema (dark ou light)
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Login</Text>

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text, // Cor do texto digitado (adaptado ao tema)
            width: '80%',
            backgroundColor: theme.card, //Fundo do input adaptado ao tema
          },
        ]}
        placeholder="Insira seu Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        // Ajusta a cor do placeholder para ter bom contraste com o tema
        placeholderTextColor={dark ? '#BBB' : '#888'}
      />

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text, // Cor do texto digitado (adaptado ao tema)
            width: '80%',
            backgroundColor: theme.card, //Fundo do input adaptado ao tema
          },
        ]}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        // Ajusta a cor do placeholder para ter bom contraste com o tema
        placeholderTextColor={dark ? '#BBB' : '#888'}
      />

      <TouchableOpacity style={[styles.button, { width: '80%' }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'gray', width: '80%' }]}
        onPress={onBack} // Botão para voltar para a tela anterior
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

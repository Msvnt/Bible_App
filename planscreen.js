import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAYS } from './constants';
import { styles } from './styles';

//  Planejamento semanal
function PlanScreen({ theme, dark }) {
  const [weeklyPlan, setWeeklyPlan] = useState(Array(7).fill(''));
  const debounceTimeout = useRef();

  // Carregar plano salvo ao iniciar
  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const savedPlan = await AsyncStorage.getItem('weeklyPlan');
      if (savedPlan) {
        setWeeklyPlan(JSON.parse(savedPlan));
      }
    } catch (error) {
      console.error('Erro ao carregar plano semanal:', error);
    }
  };

  const savePlan = async (plan) => {
    try {
      await AsyncStorage.setItem('weeklyPlan', JSON.stringify(plan));
    } catch (error) {
      console.error('Erro ao salvar plano semanal:', error);
    }
  };

  // Debounce para salvar após digitação
  const handlePlanChange = (i, text) => {
    const updated = [...weeklyPlan];
    updated[i] = text;
    setWeeklyPlan(updated);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      savePlan(updated);
    }, 800);
  };

  // Limpeza do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        📅 Planejamento Semanal
      </Text>
      {weeklyPlan.map((item, i) => (
        <View key={DAYS[i]} style={{ marginBottom: 10 }}>
          <Text style={{ color: theme.text, marginBottom: 4, fontWeight: '500' }}>
            {DAYS[i]}
          </Text>
          <TextInput
            accessibilityLabel={`Plano para ${DAYS[i]}`}
            placeholder={`Planos para ${DAYS[i]}...`}
            value={item}
            onChangeText={(text) => handlePlanChange(i, text)}
            style={[
              styles.input,
              {
                backgroundColor: dark ? '#222' : '#f5f5f5',
                color: theme.text,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
            placeholderTextColor={dark ? '#aaa' : '#888'}
            multiline={true}
            numberOfLines={2}
          />
        </View>
      ))}
    </View>
  );
}

export default PlanScreen;
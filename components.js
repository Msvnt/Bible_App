import React from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

// Componente para Modal de seleção com melhorias
function SelectionModal({
  visible,
  items,
  onSelect,
  onClose,
  selectedItem,
  theme,
  fontSize = 'média',
  fontSizeMap = { pequena: 15, média: 19, grande: 23 }
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.modalHeader, { backgroundColor: theme.primary }]}>
          <Text style={[styles.modalHeaderText, { fontSize: fontSizeMap[fontSize] }]}>Selecionar</Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar seleção"
          >
            <Text style={styles.closeButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {items.length === 0 ? (
            <Text
              style={{
                color: theme.text,
                textAlign: 'center',
                fontSize: fontSizeMap[fontSize]
              }}
            >
              Nenhum item disponível.
            </Text>
          ) : (
            items.map((item, idx) => (
              <TouchableOpacity
                key={typeof item === 'string' ? item : idx}
                accessibilityLabel={`Selecionar ${item}`}
                accessibilityRole="button"
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                style={[
                  styles.selectionItem,
                  {
                    backgroundColor: selectedItem === item ? theme.primary : 'transparent',
                    borderWidth: selectedItem === item ? 2 : 0,
                    borderColor: selectedItem === item ? '#fff' : 'transparent',
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedItem === item ? '#fff' : theme.text,
                    fontWeight: selectedItem === item ? '600' : 'normal',
                    fontSize: fontSizeMap[fontSize]
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default SelectionModal;
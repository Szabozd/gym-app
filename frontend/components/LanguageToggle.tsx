import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguageStore } from '../store/languageStore';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <View style={styles.container} testID="language-toggle">
      <TouchableOpacity
        testID="lang-en-btn"
        style={[styles.btn, language === 'en' && styles.btnActive]}
        onPress={() => setLanguage('en')}
      >
        <Text style={[styles.btnText, language === 'en' && styles.btnTextActive]}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="lang-hu-btn"
        style={[styles.btn, language === 'hu' && styles.btnActive]}
        onPress={() => setLanguage('hu')}
      >
        <Text style={[styles.btnText, language === 'hu' && styles.btnTextActive]}>HU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 2,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnActive: {
    backgroundColor: '#4CAF50',
  },
  btnText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
  },
  btnTextActive: {
    color: '#fff',
  },
});

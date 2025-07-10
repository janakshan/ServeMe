// app/(modals)/notification.tsx - CREATE THIS FILE
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/ui/Button';
import { router } from 'expo-router';

export default function NotificationModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.message}>You have no new notifications</Text>
      <Button 
        title="Close" 
        onPress={() => router.back()}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    minWidth: 120,
  },
});

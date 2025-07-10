// app/(app)/(tabs)/payments.tsx - CREATE THIS FILE
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function PaymentsScreen() {
  const paymentMethods = [
    {
      id: '1',
      type: 'Credit Card',
      last4: '1234',
      brand: 'Visa',
    },
    {
      id: '2',
      type: 'Credit Card',
      last4: '5678',
      brand: 'Mastercard',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      
      {paymentMethods.map((method) => (
        <Card key={method.id} style={styles.paymentCard}>
          <Text style={styles.paymentType}>{method.brand} {method.type}</Text>
          <Text style={styles.paymentDetails}>**** **** **** {method.last4}</Text>
        </Card>
      ))}

      <Button
        title="Add Payment Method"
        onPress={() => console.log('Add payment method')}
        style={styles.addButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  paymentCard: {
    margin: 15,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentDetails: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    margin: 20,
  },
});
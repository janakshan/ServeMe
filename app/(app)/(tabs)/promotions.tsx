// app/(app)/(tabs)/promotions.tsx - CREATE THIS FILE
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../../components/ui/Card';

export default function PromotionsScreen() {
  const promotions = [
    {
      id: '1',
      title: '50% Off First Booking',
      description: 'Get 50% off your first restaurant reservation',
      validUntil: '2025-08-01',
    },
    {
      id: '2',
      title: 'Free Education Course',
      description: 'Enroll in any course for free this month',
      validUntil: '2025-07-31',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Current Promotions</Text>
      {promotions.map((promotion) => (
        <Card key={promotion.id} style={styles.promotionCard}>
          <Text style={styles.promotionTitle}>{promotion.title}</Text>
          <Text style={styles.promotionDescription}>{promotion.description}</Text>
          <Text style={styles.validUntil}>Valid until: {promotion.validUntil}</Text>
        </Card>
      ))}
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
  promotionCard: {
    margin: 15,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  validUntil: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});

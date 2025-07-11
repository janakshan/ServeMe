// app/(services)/booking/(tabs)/index.tsx - UPDATED with back navigation
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { router } from 'expo-router';

export default function BookingHomeScreen() {
  const bookingCategories = [
    { id: '1', name: 'Restaurant', color: '#FF6B6B' },
    { id: '2', name: 'Hotel', color: '#4ECDC4' },
    { id: '3', name: 'Spa', color: '#45B7D1' },
    { id: '4', name: 'Salon', color: '#96CEB4' },
  ];

  const handleBooking = (categoryName: string) => {
    console.log(`📅 Booking ${categoryName}`);
    // You can add booking logic here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Your Experience</Text>
        <Text style={styles.subtitle}>Choose from our available services</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {bookingCategories.map((category) => (
          <Card key={category.id} style={styles.categoryCard}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Button
              title="Book Now"
              onPress={() => handleBooking(category.name)}
              style={[styles.bookButton, { backgroundColor: category.color }]}
            />
          </Card>
        ))}
      </View>

      {/* Back to Main App Button */}
      <View style={styles.navigationContainer}>
        <Button
          title="🏠 Back to Main App"
          onPress={() => {
            console.log('🔙 Navigating back to main app');
            router.push('/(app)/(tabs)');
          }}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  categoriesContainer: {
    padding: 15,
  },
  categoryCard: {
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  bookButton: {
    paddingHorizontal: 30,
  },
  navigationContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    backgroundColor: '#fff',
  },
  backButton: {
    borderColor: '#007AFF',
  },
});
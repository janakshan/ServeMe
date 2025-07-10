// app/(services)/booking/(tabs)/favorites.tsx - FIXED FILENAME
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../../../components/ui/Button';
import { router } from 'expo-router';

export default function BookingFavoritesScreen() {
  const favoriteBookings = [
    {
      id: '1',
      name: 'The Fine Dining',
      type: 'Restaurant',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Luxury Spa Resort',
      type: 'Spa',
      rating: 4.9,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Favorite Bookings</Text>
      
      {favoriteBookings.length > 0 ? (
        favoriteBookings.map((booking) => (
          <View key={booking.id} style={styles.favoriteCard}>
            <Text style={styles.bookingName}>{booking.name}</Text>
            <Text style={styles.bookingType}>{booking.type}</Text>
            <Text style={styles.rating}>⭐ {booking.rating}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Start booking to add favorites!</Text>
        </View>
      )}

      <Button
        title="🏠 Back to Main App"
        onPress={() => router.push('/(app)/(tabs)')}
        variant="outline"
        style={styles.backButton}
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
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  favoriteCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookingType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#FF9500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  backButton: {
    margin: 20,
    borderColor: '#007AFF',
  },
});

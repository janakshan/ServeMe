// app/(services)/booking/(tabs)/history.tsx - UPDATED with back navigation
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { router } from 'expo-router';

export default function BookingHistoryScreen() {
  const bookingHistory = [
    {
      id: '1',
      service: 'Restaurant',
      name: 'The Fine Dining',
      date: '2025-06-15',
      time: '7:00 PM',
      status: 'Completed',
      guests: 4,
    },
    {
      id: '2',
      service: 'Hotel',
      name: 'Grand Hotel',
      date: '2025-06-20',
      time: '3:00 PM',
      status: 'Upcoming',
      nights: 3,
    },
    {
      id: '3',
      service: 'Spa',
      name: 'Relaxation Spa',
      date: '2025-05-10',
      time: '2:00 PM',
      status: 'Completed',
      duration: '90 min',
    },
  ];

  const renderBookingItem = ({ item }: { item: any }) => (
    <Card style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.serviceName}>{item.service}</Text>
        <Text style={[
          styles.status, 
          { color: item.status === 'Completed' ? '#34C759' : '#FF9500' }
        ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.bookingName}>{item.name}</Text>
      <Text style={styles.bookingDate}>{item.date} at {item.time}</Text>
      {item.guests && <Text style={styles.detail}>👥 {item.guests} guests</Text>}
      {item.nights && <Text style={styles.detail}>🌙 {item.nights} nights</Text>}
      {item.duration && <Text style={styles.detail}>⏱️ {item.duration}</Text>}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      
      <FlatList
        data={bookingHistory}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.navigationContainer}>
        <Button
          title="🏠 Back to Main App"
          onPress={() => router.push('/(app)/(tabs)')}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    </View>
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
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Space for back button
  },
  bookingCard: {
    marginBottom: 15,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bookingName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  backButton: {
    borderColor: '#007AFF',
  },
});
// app/(app)/(tabs)/index.tsx - Home/Services List
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useServices } from '@/hooks/useServices';
import { ServiceCard } from '@/components/service/ServiceCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomeScreen() {
  const { services, isLoading, fetchServices } = useServices();

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServicePress = (serviceId: string, serviceType: string) => {
    // Navigate to specific service layout
    router.push(`/(services)/${serviceType}/(tabs)`);
  };

  const renderServiceItem = ({ item }: { item: any }) => (
    <ServiceCard 
      service={item}
      onPress={() => handleServicePress(item.id, item.type)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Services</Text>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-around',
  },
});
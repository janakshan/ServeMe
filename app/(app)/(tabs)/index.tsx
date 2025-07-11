// app/(app)/(tabs)/index.tsx - UPDATED with better service navigation
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { useServices } from "../../../hooks/useServices";

function ServiceCard({
  service,
  onPress,
}: {
  service: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={cardStyles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[cardStyles.iconContainer, { backgroundColor: service.color }]}
      >
        <Text style={cardStyles.icon}>{service.icon}</Text>
      </View>
      <Text style={cardStyles.title}>{service.name}</Text>
      <Text style={cardStyles.description} numberOfLines={2}>
        {service.description}
      </Text>
      {service.isActive && <View style={cardStyles.activeBadge} />}
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { services, isLoading, fetchServices } = useServices();

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServicePress = (serviceId: string, serviceType: string) => {
    console.log("🎯 Service pressed:", { serviceId, serviceType });

    if (serviceType === "booking") {
      // Navigate to booking service
      router.push("/(services)/booking/(tabs)");
    } else {
      // Show alert for other services (not implemented yet)
      Alert.alert(
        `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service`,
        `The ${serviceType} service will be available soon!\n\nCurrently only booking service is implemented.`,
        [
          { text: "OK" },
          {
            text: "Go to Booking",
            onPress: () => router.push("/(services)/booking/(tabs)"),
          },
        ]
      );
    }
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
      {/* <View style={styles.header}>
        <Text style={styles.title}>Our Services</Text>
        <Text style={styles.subtitle}>Choose a service to get started</Text>
      </View> */}

      {/* <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: "space-around",
  },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 160,
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  description: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  activeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
  },
});

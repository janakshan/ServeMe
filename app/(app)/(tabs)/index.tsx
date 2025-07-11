import { useThemedStyles, useServiceTheme } from "@/contexts/ServiceThemeContext";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { ScreenHeader } from "../../../components/ui/ScreenHeader";
import { useServices } from "../../../hooks/useServices";

// Loading skeleton component
const ServiceCardSkeleton = ({ index }: { index: number }) => {
  const { tokens } = useServiceTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[
      {
        backgroundColor: tokens.colors.surface,
        borderRadius: tokens.borderRadius.card,
        padding: tokens.spacing.cardPadding.vertical,
        paddingHorizontal: tokens.spacing.cardPadding.horizontal,
        margin: tokens.spacing.sm,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        flex: 1,
        ...tokens.shadows.sm,
      }
    ]}>
      <Animated.View style={[
        {
          width: 60,
          height: 60,
          backgroundColor: tokens.colors.divider,
          borderRadius: tokens.borderRadius.lg,
          marginBottom: tokens.spacing.md,
          opacity: shimmerOpacity,
        }
      ]} />
      <Animated.View style={[
        {
          width: '80%',
          height: 16,
          backgroundColor: tokens.colors.divider,
          borderRadius: tokens.borderRadius.sm,
          opacity: shimmerOpacity,
        }
      ]} />
    </View>
  );
};

// Custom hook for service card animations
const useServiceCardAnimation = (index: number, isVisible: boolean) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const pressScaleAnim = useRef(new Animated.Value(1)).current;
  const shadowElevationAnim = useRef(new Animated.Value(2)).current;

  useEffect(() => {
    if (isVisible) {
      // Staggered entrance animation
      const delay = index * 100; // 100ms delay between cards
      
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, index]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(pressScaleAnim, {
        toValue: 0.95,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(shadowElevationAnim, {
        toValue: 8,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressScaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(shadowElevationAnim, {
        toValue: 2,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return {
    animatedStyles: {
      opacity: opacityAnim,
      transform: [
        { scale: Animated.multiply(scaleAnim, pressScaleAnim) },
        { translateY: translateYAnim },
      ],
    },
    shadowElevation: shadowElevationAnim,
    handlePressIn,
    handlePressOut,
  };
};

function ServiceCard({
  service,
  onPress,
  index,
}: {
  service: any;
  onPress: () => void;
  index: number;
}) {
  const cardStyles = useThemedStyles(createServiceCardStyles);
  const { tokens } = useServiceTheme();
  const { animatedStyles, shadowElevation, handlePressIn, handlePressOut } = 
    useServiceCardAnimation(index, true);

  return (
    <Animated.View style={[animatedStyles]}>
      <TouchableOpacity
        style={[
          cardStyles.container,
          {
            ...tokens.shadows.sm,
            elevation: shadowElevation,
          }
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={cardStyles.iconContainer}>
          <Image
            source={{ uri: service.imageUrl }}
            style={cardStyles.serviceImage}
            resizeMode="contain"
          />
        </View>

        <Text style={cardStyles.title} numberOfLines={1}>
          {service.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { services, isLoading, fetchServices } = useServices();
  const styles = useThemedStyles(createStyles);

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

  const renderServiceItem = ({ item, index }: { item: any; index: number }) => (
    <ServiceCard
      service={item}
      index={index}
      onPress={() => handleServicePress(item.id, item.type)}
    />
  );

  if (isLoading) {
    // Show skeleton cards while loading
    const skeletonData = Array.from({ length: 6 }, (_, index) => ({ id: `skeleton-${index}` }));
    
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Our Services"
          subtitle="Choose a service to get started"
        />
        
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular services</Text>
            <TouchableOpacity disabled>
              <Text style={[styles.seeAllText, { opacity: 0.5 }]}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.listContainer}>
            <View style={styles.row}>
              {skeletonData.slice(0, 3).map((_, index) => (
                <ServiceCardSkeleton key={index} index={index} />
              ))}
            </View>
            <View style={styles.row}>
              {skeletonData.slice(3, 6).map((_, index) => (
                <ServiceCardSkeleton key={index + 3} index={index + 3} />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Our Services"
        subtitle="Choose a service to get started"
      />

      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular services</Text>
          <TouchableOpacity onPress={() => console.log("See all pressed")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={services.slice(0, 6)}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const createStyles = (tokens, layout, variants) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: tokens.colors.background,
    },
    contentSection: {
      flex: 1,
      backgroundColor: tokens.colors.surface,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.lg,
      paddingBottom: tokens.spacing.md,
    },
    sectionTitle: {
      fontSize: tokens.typography.title,
      fontWeight: tokens.typography.bold,
      color: tokens.colors.onSurface,
    },
    seeAllText: {
      fontSize: tokens.typography.body,
      fontWeight: tokens.typography.medium,
      color: tokens.colors.primary,
    },
    listContainer: {
      padding: tokens.spacing.md,
      paddingTop: 0,
    },
    row: {
      justifyContent: "space-around",
    },
  });

const createServiceCardStyles = (tokens, layout, variants) =>
  StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.lg,
      margin: tokens.spacing.xs,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 100,
      flex: 1,
    },
    iconContainer: {
      width: 64,
      height: 64,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.md,
    },
    serviceImage: {
      width: 48,
      height: 48,
    },
    title: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.medium,
      color: tokens.colors.onSurface,
      textAlign: "center",
    },
  });

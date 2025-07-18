import {
  useServiceTheme,
  useThemedStyles,
} from "@/contexts/ServiceThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "../../../components/ui/ScreenHeader";
import { useServices } from "../../../hooks/useServices";

// Map service types to local asset images
const getServiceImage = (serviceType: string) => {
  const imageMap = {
    education: require("../../../assets/images/onbording/edu.png"),
    men_saloon: require("../../../assets/images/onbording/saloon.png"),
    vehicle_repair: require("../../../assets/images/onbording/vec.png"),
    cleaning: require("../../../assets/images/onbording/ser.png"),
    parcel: require("../../../assets/images/services/parcel.png"), // Using ser.png for parcel
    food_delivery: require("../../../assets/images/services/food.png"), // Using ser.png for food delivery
  };
  return (
    imageMap[serviceType] || require("../../../assets/images/onbording/ser.png")
  ); // Default image
};

// Mock offers data
const OFFERS_DATA = [
  {
    id: "1",
    title: "First Order",
    discount: "50% OFF",
    description: "On your first booking",
    serviceType: "food_delivery",
    themeVariant: "sunset",
    expiryText: "Limited Time",
    code: "FIRST50",
  },
  {
    id: "2",
    title: "Vehicle Service",
    discount: "30% OFF",
    description: "Professional car repair",
    serviceType: "vehicle_repair",
    themeVariant: "ocean",
    expiryText: "Valid till Dec 31",
    code: "REPAIR30",
  },
  {
    id: "3",
    title: "Education Deal",
    discount: "25% OFF",
    description: "Online courses & learning",
    serviceType: "education",
    themeVariant: "forest",
    expiryText: "New Users Only",
    code: "LEARN25",
  },
  {
    id: "4",
    title: "Grooming Special",
    discount: "40% OFF",
    description: "Men's salon services",
    serviceType: "men_saloon",
    themeVariant: "royal",
    expiryText: "Weekend Special",
    code: "GROOM40",
  },
  {
    id: "5",
    title: "Parcel Express",
    discount: "35% OFF",
    description: "Fast delivery service",
    serviceType: "parcel",
    themeVariant: "fire",
    expiryText: "Today Only",
    code: "PARCEL35",
  },
  {
    id: "6",
    title: "Home Cleaning",
    discount: "45% OFF",
    description: "Professional cleaning",
    serviceType: "cleaning",
    themeVariant: "mint",
    expiryText: "This Week",
    code: "CLEAN45",
  },
];

// Preload service images
const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    Image.prefetch(url);
  });
};

// Loading skeleton component
const ServiceCardSkeleton = ({ index }: { index: number }) => {
  const { tokens } = useServiceTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get("window");

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Stagger the animation start for each skeleton
    const delay = index * 200;
    setTimeout(() => shimmerAnimation.start(), delay);
    
    return () => shimmerAnimation.stop();
  }, [index]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  // Get soft gradient colors for skeleton that match the service card style
  const getSkeletonGradient = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#0D47A1") {
      return ["#F8FAFE", "#F0F6FF", "#FFFFFF"]; // Light blue gradient
    } else if (primaryColor === "#7B1FA2") {
      return ["#FDFAFF", "#F9F2FF", "#FFFFFF"]; // Light purple gradient
    } else if (primaryColor === "#2E7D32") {
      return ["#F9FDF9", "#F2F8F2", "#FFFFFF"]; // Light green gradient
    } else if (primaryColor === "#E91E63") {
      return ["#FFFAFC", "#FFF2F7", "#FFFFFF"]; // Light pink gradient
    } else {
      return ["#F8FAFE", "#F0F6FF", "#FFFFFF"]; // Default light blue gradient
    }
  };

  // Calculate card dimensions to match real ServiceCard
  const horizontalPadding = tokens.spacing.md * 2;
  const cardSpacing = tokens.spacing.sm;
  const availableWidth = screenWidth - horizontalPadding;
  const cardWidth = (availableWidth - cardSpacing * 2) / 3;

  return (
    <View
      style={{
        width: cardWidth,
        height: cardWidth,
        marginBottom: tokens.spacing.md,
      }}
    >
      <LinearGradient
        colors={getSkeletonGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing.md,
          alignItems: "center",
          justifyContent: "center",
          ...tokens.shadows.md,
        }}
      >
        {/* Icon Container Placeholder */}
        <View
          style={{
            width: 80,
            height: 80,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: tokens.spacing.sm,
          }}
        >
          <Animated.View
            style={{
              width: 72,
              height: 72,
              backgroundColor: tokens.colors.divider,
              borderRadius: tokens.borderRadius.lg,
              opacity: shimmerOpacity,
            }}
          />
        </View>

        {/* Title Placeholder */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              width: "85%",
              height: 14,
              backgroundColor: tokens.colors.divider,
              borderRadius: tokens.borderRadius.sm,
              opacity: shimmerOpacity,
            }}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

// Offer Card Component
const OfferCard = ({ offer, index }: { offer: any; index: number }) => {
  const { tokens } = useServiceTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 150; // Staggered animation
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
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
    ]).start();
  }, [index]);

  const handleOfferPress = () => {
    console.log(`🎯 Offer pressed: ${offer.code}`);
    Alert.alert(
      `${offer.title} - ${offer.discount}`,
      `${offer.description}\n\nUse code: ${offer.code}\n${offer.expiryText}`,
      [
        { text: "Copy Code", onPress: () => console.log("Code copied") },
        {
          text: "Use Now",
          onPress: () => console.log("Redirecting to service"),
        },
      ]
    );
  };

  // Get theme colors based on variant with light, soft gradient combinations
  const getThemeColors = (variant: string) => {
    const baseColors = {
      primary: tokens.colors.primary,
      surface: tokens.colors.surface,
      accent: tokens.colors.accent || tokens.colors.primary,
    };

    switch (variant) {
      case "sunset":
        return ["#FFD6CC", "#FFF0E6", "#FFE5D9"]; // Light peach to cream gradient
      case "ocean":
        return ["#E8F8F5", "#D5F4E6", "#B8E6D2"]; // Light teal to mint gradient
      case "forest":
        return ["#E8F5E8", "#F0F8E8", "#E6F7E1"]; // Very light green gradient
      case "royal":
        return ["#F4E6FF", "#F8F0FF", "#EDD9FF"]; // Light purple gradient
      case "fire":
        return ["#FFF4E6", "#FFE8CC", "#FFD6B3"]; // Light orange to cream gradient
      case "mint":
        return ["#E8FFF8", "#F0FFF4", "#E6FFFA"]; // Very light mint gradient
      case "sky":
        return ["#E8F4FD", "#F0F8FF", "#E6F3FF"]; // Light sky blue gradient
      case "berry":
        return ["#FFE8F1", "#FFF0F6", "#FFE6F2"]; // Light pink gradient
      case "lavender":
        return ["#F4F0FF", "#F8F4FF", "#F0E6FF"]; // Light lavender gradient
      case "coral":
        return ["#FFE8E8", "#FFF0F0", "#FFE6E6"]; // Light coral gradient
      default:
        // Fallback to theme colors
        return [baseColors.primary, baseColors.accent, baseColors.surface];
    }
  };

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handleOfferPress}
        activeOpacity={0.9}
        style={{
          marginRight: tokens.spacing.md,
          width: 280,
          height: 140,
        }}
      >
        <LinearGradient
          colors={getThemeColors(offer.themeVariant)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.lg,
            justifyContent: "space-between",
            ...tokens.shadows.md,
          }}
        >
          {/* Top Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: tokens.typography.title,
                  fontWeight: tokens.typography.bold,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.xs,
                }}
              >
                {offer.title}
              </Text>
              <Text
                style={{
                  fontSize: tokens.typography.body,
                  color: tokens.colors.onSurface,
                  opacity: 0.7,
                }}
              >
                {offer.description}
              </Text>
            </View>

            {/* Service Icon */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: `${tokens.colors.onSurface}10`,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: tokens.spacing.sm,
              }}
            >
              <Image
                source={getServiceImage(offer.serviceType)}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Bottom Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: tokens.typography.headline,
                  fontWeight: tokens.typography.bold,
                  color: tokens.colors.onSurface,
                }}
              >
                {offer.discount}
              </Text>
              <Text
                style={{
                  fontSize: tokens.typography.caption,
                  color: tokens.colors.onSurface,
                  opacity: 0.6,
                }}
              >
                {offer.expiryText}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: `${tokens.colors.onSurface}15`,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderRadius: tokens.borderRadius.md,
              }}
            >
              <Text
                style={{
                  fontSize: tokens.typography.caption,
                  fontWeight: tokens.typography.semibold,
                  color: tokens.colors.onSurface,
                }}
              >
                {offer.code}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Custom hook for service card animations
const useServiceCardAnimation = (index: number, isVisible: boolean) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const pressScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      // Staggered entrance animation
      const delay = index * 50; // 50ms delay between cards

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
    Animated.spring(pressScaleAnim, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return {
    animatedStyles: {
      opacity: opacityAnim,
      transform: [
        { scale: Animated.multiply(scaleAnim, pressScaleAnim) },
        { translateY: translateYAnim },
      ],
    },
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
  const { animatedStyles, handlePressIn, handlePressOut } =
    useServiceCardAnimation(index, true);

  // Get service-specific gradient colors
  const getServiceGradient = (serviceType?: string) => {
    switch (serviceType) {
      case "education":
        return ["#F3E5F5", "#FAF0FF", "#FFFFFF"]; // Light purple gradient
      case "men_saloon":
        return ["#FFF3E0", "#FFF8F0", "#FFFFFF"]; // Light amber gradient
      case "vehicle_repair":
        return ["#E8F5E8", "#F2FBF2", "#FFFFFF"]; // Light green gradient
      case "cleaning":
        return ["#E0F2F1", "#F0F9F8", "#FFFFFF"]; // Light teal gradient
      case "parcel":
        return ["#FFF3E0", "#FFF8F0", "#FFFFFF"]; // Light orange gradient
      case "food_delivery":
        return ["#FFEBEE", "#FFF5F5", "#FFFFFF"]; // Light red gradient
      case "booking":
        return ["#E3F2FD", "#F0F8FF", "#FFFFFF"]; // Light blue gradient
      case "healthcare":
        return ["#E8F5E8", "#F2FBF2", "#FFFFFF"]; // Light green gradient
      case "entertainment":
        return ["#FCE4EC", "#FFF0F6", "#FFFFFF"]; // Light pink gradient
      default:
        return ["#F5F5F5", "#FAFAFA", "#FFFFFF"]; // Default light gray gradient
    }
  };

  return (
    <Animated.View style={[animatedStyles]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={getServiceGradient(service.type)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyles.container}
        >
          <View style={cardStyles.iconContainer}>
            <Image
              source={getServiceImage(service.type)}
              style={cardStyles.serviceImage}
              resizeMode="contain"
            />
          </View>

          <Text style={cardStyles.title} numberOfLines={1}>
            {service.name}
          </Text>
        </LinearGradient>
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

  // Preload images when services are loaded
  useEffect(() => {
    if (services.length > 0) {
      const imageUrls = services.map((service) => service.imageUrl);
      preloadImages(imageUrls);
    }
  }, [services]);

  const handleServicePress = (serviceId: string, serviceType: string) => {
    console.log("🎯 Service pressed:", { serviceId, serviceType });

    if (serviceType === "booking") {
      // Navigate to booking service
      router.push("/(services)/booking/(tabs)");
    } else if (serviceType === "education") {
      // Navigate to education home screen
      router.push("/(services)/education");
    } else {
      // Show alert for other services (not implemented yet)
      Alert.alert(
        `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service`,
        `The ${serviceType} service will be available soon!\n\nCurrently booking and education services are implemented.`,
        [
          { text: "OK" },
          {
            text: "Go to Booking",
            onPress: () => router.push("/(services)/booking/(tabs)"),
          },
          {
            text: "Go to Education",
            onPress: () => router.push("/(services)/education"),
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
    const skeletonData = Array.from({ length: 4 }, (_, index) => ({
      id: `skeleton-${index}`,
    }));

    return (
      <View style={styles.container}>
        <ScreenHeader
          title="ServeMe Services"
          subtitle="Choose a service to get started"
        />

        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Categories</Text>
            <TouchableOpacity disabled>
              <Text style={[styles.seeAllText, { opacity: 0.5 }]}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            {skeletonData.map((_, index) => (
              <ServiceCardSkeleton key={index} index={index} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="ServeMe"
        subtitle="Choose a service to get started"
      />

      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <TouchableOpacity onPress={() => console.log("See all pressed")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {services.slice(0, 6).map((item, index) => (
            <ServiceCard
              key={item.id}
              service={item}
              index={index}
              onPress={() => handleServicePress(item.id, item.type)}
            />
          ))}
        </View>
      </View>

      {/* Special Offers Section - Moved after All Categories */}
      <View style={styles.offersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <TouchableOpacity
            onPress={() => console.log("See all offers pressed")}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersContainer}
          decelerationRate="fast"
          snapToInterval={280 + 16} // card width + margin
        >
          {OFFERS_DATA.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const createStyles = (tokens, layout, variants) => {
  // Create soft blue-tinted backgrounds for better eye comfort
  const getSoftTintedColors = () => {
    const primaryColor = tokens.colors.primary;

    if (primaryColor === "#0D47A1") {
      // Professional blue theme - soft blue tints
      return {
        softBackground: "#F8FAFE", // Very light blue tint
        softSurface: "#F0F6FF", // Light blue tint for cards/surfaces
      };
    } else if (primaryColor === "#7B1FA2") {
      // Purple theme - soft purple tints
      return {
        softBackground: "#FDFAFF", // Very light purple tint
        softSurface: "#F9F2FF", // Light purple tint
      };
    } else if (primaryColor === "#2E7D32") {
      // Green theme - soft green tints
      return {
        softBackground: "#F9FDF9", // Very light green tint
        softSurface: "#F2F8F2", // Light green tint
      };
    } else if (primaryColor === "#E91E63") {
      // Pink theme - soft pink tints
      return {
        softBackground: "#FFFAFC", // Very light pink tint
        softSurface: "#FFF2F7", // Light pink tint
      };
    } else {
      // Default soft blue tints
      return {
        softBackground: "#F8FAFE",
        softSurface: "#F0F6FF",
      };
    }
  };

  const tintedColors = getSoftTintedColors();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tintedColors.softBackground,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: tintedColors.softBackground,
    },
    contentSection: {
      flex: 1,
      backgroundColor: tintedColors.softSurface,
      marginTop: -tokens.spacing.md, // Overlap with header for smoother transition
      paddingTop: tokens.spacing.lg,
      borderTopLeftRadius: tokens.borderRadius.xl,
      borderTopRightRadius: tokens.borderRadius.xl,
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
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: tokens.spacing.md,
      justifyContent: "space-between",
    },
    offersSection: {
      backgroundColor: tintedColors.softSurface,
      marginBottom: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.md,
      marginHorizontal: tokens.spacing.xs,
      ...tokens.shadows.sm,
    },
    offersContainer: {
      paddingLeft: tokens.spacing.lg,
      paddingRight: tokens.spacing.sm,
    },
  });
};

const createServiceCardStyles = (tokens: any) => {
  const { width: screenWidth } = Dimensions.get("window");
  const horizontalPadding = tokens.spacing.md * 2; // Container padding both sides
  const cardSpacing = tokens.spacing.sm; // Space between cards
  const availableWidth = screenWidth - horizontalPadding;
  const cardWidth = (availableWidth - cardSpacing * 2) / 3; // 3 columns with spacing

  return StyleSheet.create({
    container: {
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      alignItems: "center",
      justifyContent: "center",
      width: cardWidth,
      height: cardWidth, // Square cards
      ...tokens.shadows.md, // Enhanced shadow for depth
    },
    iconContainer: {
      width: 80,
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: tokens.spacing.sm,
    },
    serviceImage: {
      width: 72,
      height: 72,
    },
    title: {
      fontSize: tokens.typography.caption,
      fontWeight: tokens.typography.medium,
      color: tokens.colors.onSurface,
      textAlign: "center",
    },
  });
};

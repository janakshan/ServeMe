// components/service/ServiceCard.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Service } from '@/utils/types';
import { Colors, Spacing, Typography } from '@/utils/constants';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
        <Text style={styles.icon}>{service.icon}</Text>
      </View>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>
      {service.isActive && <View style={styles.activeBadge} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    margin: Spacing.sm,
    alignItems: 'center',
    shadowColor: Colors.black,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontSize: Typography.headline,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.caption,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
});

// components/navigation/TabBarIcon.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
}

export function TabBarIcon({ name, color, focused, size = 24 }: TabBarIconProps) {
  // You can customize the icon behavior here
  const iconName = focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap);
  
  return <Ionicons name={iconName} size={size} color={color} />;
}
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function HomeTab() {
  useEffect(() => {
    // Redirect to the main education home screen
    router.replace('/(services)/education/');
  }, []);

  return null;
}
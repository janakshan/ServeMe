// components/forms/LoginForm.tsx - UPDATED with better debugging
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginForm({ onSubmit, isLoading = false, onForgotPassword, onSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('test@example.com'); // Pre-filled for testing
  const [password, setPassword] = useState('password');   // Pre-filled for testing
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('📝 Form submitted with:', { email, password });
    
    if (validateForm()) {
      onSubmit(email, password);
    } else {
      console.log('❌ Form validation failed:', errors);
    }
  };

  // Quick test function
  const handleQuickTest = () => {
    console.log('🚀 Quick test login');
    setEmail('test@example.com');
    setPassword('password');
    setTimeout(() => {
      onSubmit('test@example.com', 'password');
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password}
      />

      <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button
        title="Sign In"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />
      
      {/* Debug button - remove in production */}
      <Button
        title="🚀 Quick Test Login"
        onPress={handleQuickTest}
        variant="outline"
        style={styles.testButton}
      />

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={onSignUp}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  submitButton: {
    marginBottom: 10,
  },
  testButton: {
    marginBottom: 20,
    borderColor: '#FF9500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
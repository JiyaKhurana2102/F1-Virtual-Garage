import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

// Home screen: shows app title, tagline and a simple CTA
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>F1 Virtual Garage</Text>
        <Text style={styles.tagline}>Learn the engineering behind Formula 1</Text>

        <Text style={styles.cta}>
          Explore the Garage to view a 3D car model and learn key systems like
          aerodynamics, tires, and brakes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 20,
    textAlign: 'center',
  },
  cta: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 560,
  },
});

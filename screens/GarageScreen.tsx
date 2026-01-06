import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import GarageScene from '../components/GarageScene';

// Garage screen: displays a header and the 3D garage scene
export default function GarageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Virtual Garage</Text>
      </View>

      <View style={styles.sceneWrapper}>
        <GarageScene />
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  sceneWrapper: {
    flex: 1,
    // Reserve most of the screen for the 3D scene
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

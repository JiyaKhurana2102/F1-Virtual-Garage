import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import lessons from '../data/lessons';

// Learn screen: shows a list of lesson cards using mock data
export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Learning</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {lessons.map((lesson) => (
          <View key={lesson.id} style={styles.card}>
            <Text style={styles.cardTitle}>{lesson.title}</Text>
            <Text style={styles.cardDesc}>{lesson.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  scroll: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#121214',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDesc: {
    color: '#CFCFCF',
    fontSize: 14,
    lineHeight: 20,
  },
});

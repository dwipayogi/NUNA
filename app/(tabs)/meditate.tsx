import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/colors';

import Feather from '@expo/vector-icons/Feather';

const { width } = Dimensions.get('window');

// Sample meditation sessions
const MEDITATION_SESSIONS = [
  {
    id: '1',
    title: 'Calm Focus',
    description: 'Improve concentration for study sessions',
    duration: '10 min',
    image: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Stress Relief',
    description: 'Release tension and anxiety',
    duration: '15 min',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#FACC15',
  },
  {
    id: '3',
    title: 'Deep Sleep',
    description: 'Prepare your mind for restful sleep',
    duration: '20 min',
    image: 'https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#7C3AED',
  },
  {
    id: '4',
    title: 'Quick Reset',
    description: 'Rapid mindfulness for busy days',
    duration: '5 min',
    image: 'https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#10B981',
  },
];

// Sample breathing exercises
const BREATHING_EXERCISES = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8',
    duration: '5 min',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Box Breathing',
    description: 'Equal timing for inhale, hold, exhale, and pause',
    duration: '5 min',
    image: 'https://images.pexels.com/photos/1834407/pexels-photo-1834407.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#FACC15',
  },
  {
    id: '3',
    title: 'Diaphragmatic',
    description: 'Deep belly breathing for relaxation',
    duration: '10 min',
    image: 'https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#EC4899',
  },
];

export default function MeditateScreen() {
  const [activeTab, setActiveTab] = useState('meditate');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(300);
  const [currentPage, setCurrentPage] = useState(0);
  
  const scrollViewRef = useRef(null);

  const data = activeTab === 'meditate' ? MEDITATION_SESSIONS : BREATHING_EXERCISES;
  const pages = Math.ceil(data.length / 4);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderCard = ({ item }: { item: typeof MEDITATION_SESSIONS[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setTotalTime(parseInt(item.duration) * 60);
        setCurrentTime(0);
        setIsPlaying(true);
      }}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDuration}>{item.duration}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mindfulness</Text>
        <TouchableOpacity style={styles.menuButton}>
          {/* <Menu size={20} color="#64748B" /> */}
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'meditate' && styles.activeTab]}
          onPress={() => {
            setActiveTab('meditate');
            setCurrentPage(0);
          }}
        >
          <Text style={[styles.tabText, activeTab === 'meditate' && styles.activeTabText]}>
            Meditate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'breathe' && styles.activeTab]}
          onPress={() => {
            setActiveTab('breathe');
            setCurrentPage(0);
          }}
        >
          <Text style={[styles.tabText, activeTab === 'breathe' && styles.activeTabText]}>
            Breathing
          </Text>
        </TouchableOpacity>
      </View>

      {isPlaying ? (
        <View style={styles.playerContainer}>
          <Text style={styles.playerTitle}>
            {activeTab === 'meditate' ? 'Meditation Session' : 'Breathing Exercise'}
          </Text>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(currentTime / totalTime) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton}>
              {/* <SkipBack size={24} color="#64748B" /> */}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playPauseButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Feather name="pause" size={24} color="#FFFFFF" />
              ) : (
                <Feather name="play" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              {/* <SkipForward size={24} color="#64748B" /> */}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            {Array.from({ length: pages }).map((_, pageIndex) => (
              <View key={pageIndex} style={styles.page}>
                <View style={styles.grid}>
                  {data.slice(pageIndex * 4, (pageIndex + 1) * 4).map((item) => (
                    <View key={item.id} style={styles.cardWrapper}>
                      {renderCard({ item })}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    color: '#1E293B',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  carouselContainer: {
    flex: 1,
  },
  page: {
    width: width,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    height: 200,
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  cardTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDuration: {
    fontSize: 12,
    color: '#F1F5F9',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.5,
  },
  pageIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  activePageIndicator: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  playerTitle: {
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 40,
    textAlign: 'center',
  },
  timerContainer: {
    width: '100%',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 20,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '100%',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
  },
});
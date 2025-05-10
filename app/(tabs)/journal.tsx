import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Feather from '@expo/vector-icons/Feather';

import { colors } from '@/constants/colors';

// Sample journal entries
const JOURNAL_ENTRIES = [
  {
    id: '1',
    date: '2025-06-14',
    title: 'Persiapan ujian',
    content: 'Saya merasa kewalahan dengan ujian akhir yang akan datang. Perlu membuat rencana belajar yang lebih baik.',
    mood: 'Stres',
    color: '#FB923C',
  },
  {
    id: '2',
    date: '2025-06-13',
    title: 'Kemajuan proyek kelompok',
    content: 'Rapat tim kami berjalan dengan baik hari ini. Kami akhirnya sepakat dengan arah proyek.',
    mood: 'Produktif',
    color: '#4ADE80',
  },
  {
    id: '3',
    date: '2025-06-12',
    title: 'Meditasi pagi',
    content: 'Memulai hari dengan sesi meditasi selama 10 menit. Merasa tenang dan fokus.',
    mood: 'Damai',
    color: '#3B82F6',
  },
  {
    id: '4',
    date: '2025-06-11',
    title: 'Pikiran larut malam',
    content: 'Sulit tidur. Khawatir tentang persyaratan kelulusan.',
    mood: 'Cemas',
    color: '#F87171',
  },
];

// Journal prompts
const PROMPTS = [
  "Apa yang membuatmu tersenyum hari ini?",
  "Apa yang menjadi tantanganmu hari ini?",
  "Apa yang kamu syukuri saat ini?",
  "Apa satu pencapaian kecil yang kamu raih hari ini?",
  "Bagaimana kamu merawat dirimu sendiri hari ini?",
  "Apa yang baru saja kamu pelajari?",
  "Apa yang mengganggumu dan perlu kamu lepaskan?",
  "Apa yang kamu nantikan besok?",
];

export default function JournalScreen() {
  const [activeTab, setActiveTab] = useState('catatan');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  
  const promptModalAnim = useRef(new Animated.Value(0)).current;

  const showModal = () => {
    setShowPromptModal(true);
    Animated.timing(promptModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(promptModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPromptModal(false);
    });
  };

  const formatDate = (dateString: string) => {
    const options = { weekday: 'short' as const, month: 'short' as const, day: 'numeric' as const };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderJournalEntry = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => {/* Navigate to entry detail */}}
    >
      <View style={[styles.entryMoodIndicator, { backgroundColor: item.color }]} />
      <View style={styles.entryContent}>
        <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
        <Text style={styles.entryTitle}>{item.title}</Text>
        <Text style={styles.entryPreview} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.entryFooter}>
          <View style={[styles.moodTag, { backgroundColor: `${item.color}20` }]}>
            <Text style={[styles.moodText, { color: item.color }]}>{item.mood}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catatan Harian</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'catatan' && styles.activeTab]}
          onPress={() => setActiveTab('catatan')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'catatan' && styles.activeTabText
            ]}
          >
            Catatan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'stats' && styles.activeTabText
            ]}
          >
            Analisis
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'catatan' ? (
        <FlatList
          data={JOURNAL_ENTRIES}
          renderItem={renderJournalEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.entriesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView 
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsCard}>
            <Text style={styles.statsCardTitle}>Monthly Overview</Text>
            <Text style={styles.statsCardSubtitle}>June 2025</Text>
            
            <View style={styles.calendarPlaceholder}>
              <Text style={styles.placeholderText}>Calendar view will be displayed here</Text>
            </View>
            
            <View style={styles.moodSummary}>
              <Text style={styles.moodSummaryTitle}>Mood Summary</Text>
              <View style={styles.moodDistribution}>
                <View style={styles.moodPercentage}>
                  <View style={[styles.moodPercentBar, { backgroundColor: '#4ADE80', width: '40%' }]} />
                  <Text style={styles.moodPercentText}>Positive: 40%</Text>
                </View>
                <View style={styles.moodPercentage}>
                  <View style={[styles.moodPercentBar, { backgroundColor: '#FACC15', width: '30%' }]} />
                  <Text style={styles.moodPercentText}>Neutral: 30%</Text>
                </View>
                <View style={styles.moodPercentage}>
                  <View style={[styles.moodPercentBar, { backgroundColor: '#F87171', width: '30%' }]} />
                  <Text style={styles.moodPercentText}>Negative: 30%</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.topicsCard}>
            <Text style={styles.statsCardTitle}>Topik Umum</Text>
            <View style={styles.topicTags}>
              <View style={styles.topicTag}>
              <Text style={styles.topicTagText}>ujian</Text>
              </View>
              <View style={styles.topicTag}>
              <Text style={styles.topicTagText}>stres</Text>
              </View>
              <View style={styles.topicTag}>
              <Text style={styles.topicTagText}>tidur</Text>
              </View>
              <View style={styles.topicTag}>
              <Text style={styles.topicTagText}>teman</Text>
              </View>
              <View style={styles.topicTag}>
              <Text style={styles.topicTagText}>proyek</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <TouchableOpacity 
        style={styles.newEntryButton}
        onPress={showModal}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {showPromptModal && (
        <Animated.View 
          style={[
            styles.promptModalContainer,
            {
              opacity: promptModalAnim,
              transform: [
                {
                  translateY: promptModalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.promptModal}>
            <View style={styles.promptModalHeader}>
              <Text style={styles.promptModalTitle}>Buat catatan baru</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={hideModal}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.blankEntryOption}>
              <Feather name="edit-2" size={24} color="#3B82F6" />
              <Text style={styles.optionText}>Mulai dengan halaman kosong</Text>
            </TouchableOpacity>
            
            <View style={styles.promptsSection}>
              <Text style={styles.promptsSectionTitle}>Prompt</Text>
              {PROMPTS.map((prompt, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.promptOption}
                  onPress={() => {
                    setSelectedPrompt(prompt);
                    hideModal();
                    // Logic to start new entry with prompt
                  }}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
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
    fontWeight: 'bold',
    color: colors.primaryBlue,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primaryBlue,
  },
  tabText: {
    fontSize: 14,
    color: colors.primaryBlue,
  },
  activeTabText: {
    color: colors.backgroundBlue,
  },
  entriesList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  entryMoodIndicator: {
    width: 4,
    height: '100%',
  },
  entryContent: {
    flex: 1,
    padding: 16,
  },
  entryDate: {
    fontSize: 12,
    color: colors.grayTwo,
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  entryPreview: {
    fontSize: 14,
    color: colors.grayTwo,
    marginBottom: 12,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  moodText: {
    fontSize: 12,
  },
  newEntryButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  promptModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  promptModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '80%',
  },
  promptModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptModalTitle: {
    fontSize: 18,
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blankEntryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  promptsSection: {
    marginBottom: 24,
  },
  promptsSectionTitle: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  promptOption: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#475569',
  },
  statsContainer: {
    flex: 1,
  },
  statsContent: {
    padding: 16,
    paddingBottom: 80,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsCardTitle: {
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 4,
  },
  statsCardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  calendarPlaceholder: {
    height: 200,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#64748B',
  },
  moodSummary: {
    marginTop: 8,
  },
  moodSummaryTitle: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  moodDistribution: {
    marginTop: 8,
  },
  moodPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodPercentBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  moodPercentText: {
    fontSize: 14,
    color: '#475569',
  },
  topicsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topicTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  topicTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  topicTagText: {
    fontSize: 14,
    color: '#475569',
  },
});
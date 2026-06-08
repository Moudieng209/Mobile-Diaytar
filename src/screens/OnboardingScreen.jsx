import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const PURPLE = '#6C63FF';

const SLIDES = [
  {
    id: '1',
    icon: 'sparkles-outline',
    iconColor: PURPLE,
    iconBg: '#E8E6FF',
    bg: '#F4F3FF',
    title: 'Bienvenue sur notre app',
    subtitle: 'Découvrez une nouvelle expérience',
  },
  {
    id: '2',
    icon: 'notifications-outline',
    iconColor: '#1D9E75',
    iconBg: '#D1F5E4',
    bg: '#F0FBF6',
    title: 'Restez connecté',
    subtitle: 'Recevez des notifications en temps réel',
  },
  {
    id: '3',
    icon: 'rocket-outline',
    iconColor: '#BA7517',
    iconBg: '#FFE8C2',
    bg: '#FFF7ED',
    title: 'Prêt à commencer ?',
    subtitle: 'Rejoignez-nous et profitez de tous nos services',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem('onboardingDone', 'true');
    onDone();
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={s.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[s.slide, { width }]}>
            <View style={[s.illustrationWrap, { backgroundColor: item.bg }]}>
              <View style={[s.iconCircle, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={56} color={item.iconColor} />
              </View>
            </View>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={s.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === currentIndex && s.dotActive]}
          />
        ))}
      </View>

      {/* Bouton */}
      <View style={s.btnWrap}>
        {isLast ? (
          <TouchableOpacity style={s.btn} onPress={handleDone}>
            <Text style={s.btnText}>COMMENCER</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.btn} onPress={handleNext}>
            <Text style={s.btnText}>SUIVANT</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  slide: { alignItems: 'center', paddingTop: 60 },
  illustrationWrap: {
    width: 220, height: 220, borderRadius: 110,
    justifyContent: 'center', alignItems: 'center', marginBottom: 40
  },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center'
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', textAlign: 'center', paddingHorizontal: 30 },
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center', marginTop: 12, paddingHorizontal: 40, lineHeight: 22 },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },
  dotActive: { width: 24, borderRadius: 4, backgroundColor: PURPLE },
  btnWrap: { position: 'absolute', bottom: 50, width: '100%', paddingHorizontal: 30 },
  btn: {
    backgroundColor: PURPLE, borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
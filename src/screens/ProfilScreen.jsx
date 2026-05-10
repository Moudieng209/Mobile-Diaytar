import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Alert, Image, ActivityIndicator, PermissionsAndroid, Platform,
  Modal, TextInput, KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import API from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const PURPLE = '#6C63FF';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.photo || null);
  const [uploading, setUploading]       = useState(false);

  // MODAL ÉDITION
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [form, setForm] = useState({
    prenom:    user?.prenom    || '',
    nom:       user?.nom       || '',
    telephone: user?.telephone || '',
    password:  '',
  });

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (form.prenom    !== user.prenom)    payload.prenom    = form.prenom;
      if (form.nom       !== user.nom)       payload.nom       = form.nom;
      if (form.telephone !== user.telephone) payload.telephone = form.telephone;
      if (form.password)                     payload.password  = form.password;

      if (Object.keys(payload).length === 0) {
        setModalVisible(false);
        return;
      }

      const { data } = await API.put('/api/auth/profile', payload);
      await updateUser({ ...user, ...data.utilisateur });
      setModalVisible(false);
      setForm(f => ({ ...f, password: '' }));
      Alert.alert('Succès', 'Profil mis à jour !');
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  //PHOTO
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const uploadPhoto = async (uri) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', { uri, type: 'image/jpeg', name: 'profile.jpg' });
      const { data } = await API.put('/api/auth/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileImage(data.photo);
      await updateUser({ ...user, photo: data.photo });
      Alert.alert('Succès', 'Photo mise à jour !');
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  const openCamera = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return Alert.alert('Permission refusée');
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (result.assets) await uploadPhoto(result.assets[0].uri);
  };

  const openLibrary = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets) await uploadPhoto(result.assets[0].uri);
  };

  const handleEditPhoto = () => {
    Alert.alert('Photo de profil', 'Comment souhaitez-vous ajouter votre photo ?', [
      { text: 'Prendre une photo',       onPress: openCamera  },
      { text: 'Choisir dans la galerie', onPress: openLibrary },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', onPress: logout },
    ]);
  };

  if (!user) return null;

  const initiales = `${user.prenom?.[0] ?? ''}${user.nom?.[0] ?? ''}`.toUpperCase();

  const infos = [
    { icon: 'mail-outline',   label: 'Email',     value: user.email },
    { icon: 'call-outline',   label: 'Téléphone', value: user.telephone || 'Non renseigné' },
    { icon: 'shield-outline', label: 'Rôle',      value: user.role === 'admin' ? 'Administrateur' : 'Client' },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* AVATAR */}
        <View style={s.avatarSection}>
          <TouchableOpacity style={s.avatarWrapper} onPress={handleEditPhoto} disabled={uploading} activeOpacity={0.8}>
            <View style={[s.avatar, !profileImage && { backgroundColor: PURPLE }]}>
              {uploading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : profileImage ? (
                <Image source={{ uri: profileImage }} style={s.image} />
              ) : (
                <Text style={s.avatarText}>{initiales}</Text>
              )}
            </View>
            <View style={s.cameraIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={s.name}>{user.prenom} {user.nom}</Text>

          {/* <View style={[s.badge, user.role === 'admin' && s.badgeAdmin]}>
            <Ionicons
              name={user.role === 'admin' ? 'shield-half-outline' : 'person-outline'}
              size={14} color={user.role === 'admin' ? '#856404' : '#534AB7'}
              style={{ marginRight: 6 }}
            />
            <Text style={[s.badgeText, user.role === 'admin' && { color: '#856404' }]}>
              {user.role === 'admin' ? 'Administrateur' : 'Client'}
            </Text>
          </View> */}
        </View>
        <View style={s.badge}>
  <Ionicons name="shield-checkmark-outline" size={14} color="#534AB7" style={{ marginRight: 6 }} />
  <Text style={s.badgeText}>
    Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
  </Text>
</View>

        {/* INFOS */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Mes informations</Text>
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => {
                setForm({ prenom: user.prenom, nom: user.nom, telephone: user.telephone || '', password: '' });
                setModalVisible(true);
              }}
            >
              <Ionicons name="pencil-outline" size={16} color={PURPLE} />
              <Text style={s.editBtnText}>Modifier</Text>
            </TouchableOpacity>
          </View>

          {infos.map(({ icon, label, value }) => (
            <View key={label} style={s.row}>
              <View style={s.rowIcon}>
                <Ionicons name={icon} size={20} color={PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>{label}</Text>
                <Text style={s.rowValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* DÉCONNEXION */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" style={{ marginRight: 10 }} />
          <Text style={s.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL ÉDITION */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={s.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Modifier mon profil</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ModalInput
              icon="person-outline"
              label="Prénom"
              value={form.prenom}
              onChangeText={v => handleChange('prenom', v)}
            />
            <ModalInput
              icon="person-outline"
              label="Nom"
              value={form.nom}
              onChangeText={v => handleChange('nom', v)}
            />
            <ModalInput
              icon="call-outline"
              label="Téléphone"
              value={form.telephone}
              onChangeText={v => handleChange('telephone', v)}
              keyboardType="phone-pad"
            />
            <ModalInput
              icon="lock-closed-outline"
              label="Nouveau mot de passe (optionnel)"
              value={form.password}
              onChangeText={v => handleChange('password', v)}
              secureTextEntry
              placeholder="Laisser vide pour ne pas changer"
            />

            <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={s.saveBtnText}>Enregistrer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function ModalInput({ icon, label, value, onChangeText, keyboardType, secureTextEntry, placeholder }) {
  return (
    <View style={s.inputWrap}>
      <Text style={s.inputLabel}>{label}</Text>
      <View style={s.inputRow}>
        <Ionicons name={icon} size={18} color={PURPLE} style={{ marginRight: 10 }} />
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder || label}
          placeholderTextColor="#bbb"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: '#F4F3FF', padding: 24 },

  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: '#E0E0E0',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5,
  },
  image:      { width: '100%', height: '100%', resizeMode: 'cover' },
  cameraIcon: {
    position: 'absolute', bottom: 2, right: 2, backgroundColor: PURPLE,
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center',
    alignItems: 'center', borderWidth: 3, borderColor: '#F4F3FF',
  },
  avatarText: { color: '#fff', fontSize: 38, fontWeight: '800' },
  name:       { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 4 },
  badge:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8E7FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  badgeAdmin: { backgroundColor: '#FFF3CD' },
  badgeText:  { fontSize: 13, fontWeight: '700', color: '#534AB7' },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 25, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle:  { fontSize: 12, fontWeight: '800', color: '#BBB', textTransform: 'uppercase', letterSpacing: 1.2 },
  editBtn:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 5 },
  editBtnText:{ fontSize: 13, fontWeight: '700', color: PURPLE },
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8F8FF' },
  rowIcon:    { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F4F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowLabel:   { fontSize: 12, color: '#999', fontWeight: '500' },
  rowValue:   { fontSize: 15, color: '#333', fontWeight: '600', marginTop: 1 },

  // Logout
  logoutBtn:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#ef4444', borderRadius: 15, padding: 16, marginBottom: 20 },
  logoutText: { color: '#ef4444', fontWeight: '800', fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard:    { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle:   { fontSize: 18, fontWeight: '800', color: '#222' },
  inputWrap:    { marginBottom: 14 },
  inputLabel:   { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 6 },
  inputRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F3FF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  input:        { flex: 1, fontSize: 15, color: '#333' },
  saveBtn:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: PURPLE, borderRadius: 14, padding: 16, marginTop: 8 },
  saveBtnText:  { color: '#fff', fontWeight: '800', fontSize: 16 },
});
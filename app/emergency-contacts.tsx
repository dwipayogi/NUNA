import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";

import { colors } from "@/constants/colors";

// Define contact type
interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  isFavorite: boolean;
}

// Initial emergency contacts
const defaultEmergencyContacts: Contact[] = [
  {
    id: "119",
    name: "Nomor Darurat Nasional",
    role: "Emergency Line",
    phone: "119",
    isFavorite: false,
  },
  {
    id: "hotline1",
    name: "Hotline Kesehatan Mental",
    role: "Mental Health Hotline",
    phone: "119 ext 8",
    isFavorite: false,
  },
  {
    id: "hotline2",
    name: "Kemenkes - Sehat Jiwa",
    role: "Government Hotline",
    phone: "0811-500-0454",
    isFavorite: false,
  },
];

export default function EmergencyContactScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Load contacts from storage
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem("emergencyContacts");
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        } else {
          setContacts(defaultEmergencyContacts);
          await AsyncStorage.setItem(
            "emergencyContacts",
            JSON.stringify(defaultEmergencyContacts)
          );
        }
      } catch (error) {
        console.error("Error loading contacts:", error);
        setContacts(defaultEmergencyContacts);
      }
    };

    loadContacts();
  }, []);

  // Save contacts to storage
  const saveContacts = async (updatedContacts: Contact[]) => {
    try {
      await AsyncStorage.setItem(
        "emergencyContacts",
        JSON.stringify(updatedContacts)
      );
    } catch (error) {
      console.error("Error saving contacts:", error);
    }
  };

  // Handle calling a contact
  const handleCall = (phone: string, name: string) => {
    Alert.alert(
      "Hubungi Kontak",
      `Anda akan menghubungi ${name} di nomor ${phone}`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hubungi",
          onPress: () => {
            const phoneNumber =
              Platform.OS === "android" ? `tel:${phone}` : `telprompt:${phone}`;
            Linking.openURL(phoneNumber).catch((err) => {
              console.error("Error opening phone app:", err);
              Alert.alert("Error", "Tidak dapat membuka aplikasi telepon");
            });
          },
        },
      ]
    );
  };

  // Add new contact
  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert("Error", "Nama dan nomor telepon harus diisi");
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName.trim(),
      role: newRole.trim() || "Personal Contact",
      phone: newPhone.trim(),
      isFavorite: false,
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContacts(updatedContacts);

    // Reset form
    setNewName("");
    setNewRole("");
    setNewPhone("");
    setShowAddForm(false);
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === id
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    );
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
  };

  // Delete contact
  const deleteContact = (id: string) => {
    // Don't allow deletion of default contacts
    if (["119", "hotline1", "hotline2"].includes(id)) {
      Alert.alert("Info", "Kontak default tidak dapat dihapus");
      return;
    }

    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menghapus kontak ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          const updatedContacts = contacts.filter(
            (contact) => contact.id !== id
          );
          setContacts(updatedContacts);
          saveContacts(updatedContacts);
        },
      },
    ]);
  };

  const favoriteContacts = contacts.filter((contact) => contact.isFavorite);
  const otherContacts = contacts.filter((contact) => !contact.isFavorite);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={colors.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kontak Darurat</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emergencySection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Feather name="alert-circle" size={24} color={colors.white} />
            </View>
            <Text style={styles.infoText}>
              Kontak darurat ini tersedia untuk membantu Anda dalam situasi
              krisis. Jangan ragu untuk menghubungi jika Anda membutuhkan
              bantuan.
            </Text>
          </View>
        </View>

        {/* Favorites Section */}
        {favoriteContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kontak Favorit</Text>
            {favoriteContacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {contact.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRole}>{contact.role}</Text>
                  </View>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(contact.id)}
                  >
                    <Feather
                      name="star"
                      size={20}
                      color="#FACC15"
                      solid={true}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCall(contact.phone, contact.name)}
                  >
                    <Feather name="phone" size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* All Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Semua Kontak</Text>
          {otherContacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {contact.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRole}>{contact.role}</Text>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(contact.id)}
                >
                  <Feather name="star" size={20} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.callButton, { marginLeft: 12 }]}
                  onPress={() => handleCall(contact.phone, contact.name)}
                >
                  <Feather name="phone" size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, { marginLeft: 8 }]}
                  onPress={() => deleteContact(contact.id)}
                >
                  <Feather name="trash-2" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Contact Form */}
        {showAddForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Tambah Kontak Baru</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nama</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama"
                value={newName}
                onChangeText={setNewName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Peran/Hubungan</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Keluarga, Psikolog, dll"
                value={newRole}
                onChangeText={setNewRole}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nomor Telepon</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nomor telepon"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setNewName("");
                  setNewRole("");
                  setNewPhone("");
                }}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={addContact}
              >
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Feather name="plus" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Tambah Kontak</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryBlue,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emergencySection: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 13,
    color: colors.grayTwo,
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteButton: {
    padding: 4,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primaryBlue,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.primaryBlue,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.black,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  formButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: colors.grayTwo,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: colors.primaryBlue,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: "500",
  },
});

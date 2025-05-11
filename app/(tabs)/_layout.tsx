import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarStyle: {
          backgroundColor: colors.backgroundBlue,
          borderTopWidth: 0,
        },
      }}
      initialRouteName="dashboard"
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => (
            <Feather name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meditate"
        options={{
          title: "Meditation",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "ChatBot",
          tabBarIcon: ({ color }) => (
            <Feather name="message-square" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: null,
        }}
      />
    </Tabs>

  );
}

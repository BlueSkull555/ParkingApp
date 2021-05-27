import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "./screens/Auth";
import Profile from "./screens/Profile";
import CarPool from "./screens/CarPool";
import Parking from "./screens/Parking";
import Settings from "./screens/Settings";
import Booking from "./screens/Booking";
import firebase from "firebase/app";
import "firebase/auth";
import { useState, useEffect } from "react";

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return user ? (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Car Pool" component={CarPool} />
        <Tab.Screen name="Parking" component={Parking} />
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Booking" component={Booking} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <Auth user={user} setUser={setUser} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

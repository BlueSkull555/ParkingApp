import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, ScrollView, LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "./screens/Auth/Auth";
import Profile from "./screens/Profile";
import Booking from "./screens/Booking";
import Settings from "./screens/Settings";
import Carpool from "./screens/CarPool";
import firebase from "firebase/app";
import "firebase/auth";
import { useState, useEffect } from "react";
import { Dimensions, ImageBackground } from "react-native";
import { Icon } from "react-native-elements";
import Color from "./Colors";
LogBox.ignoreAllLogs();

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return user ? (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: Color.red.ruby,
        }}
      >
        <Tab.Screen
          name="Parking"
          component={Booking}
          options={{
            tabBarLabel: "Parking",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="car"
                type="material-community"
                color={Color.black.oliver}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="CarPool"
          component={Carpool}
          options={{
            tabBarLabel: "CarPool",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="forum-outline"
                type="material-community"
                color={Color.black.oliver}
                size={30}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="account-outline"
                type="material-community"
                color={Color.black.oliver}
                size={30}
              />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="cog-outline"
                type="material-community"
                color={Color.black.oliver}
                size={30}
              />
            ),
          }}
        />
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
    zIndex: 1,
  },
  backgroundImage: {
    //flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    height: height,
    zIndex: -1,
  },
});

import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CarpoolHome from "../components/CarpoolHome";
import CarpoolMap from "../components/CarpoolMap";
import FindARide from "../components/FindARide";
import CarpoolChat from "../components/CarpoolChat";
import CarpoolSettings from "../components/CarpoolSettings";

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={CarpoolHome} />
      <Stack.Screen name="Map" component={CarpoolMap} />
      <Stack.Screen name="FindARide" component={FindARide} />
      <Stack.Screen name="Chat" component={CarpoolChat} />
      <Stack.Screen name="Settings" component={CarpoolSettings} />
    </Stack.Navigator>
  );
}

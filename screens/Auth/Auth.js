import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
} from "react-native";
import db from "../../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Login from "./Login";
import {
  ButtonGroup,
  Card,
  Input,
  Switch,
  Button,
  CheckBox,
  Overlay,
} from "react-native-elements";
import { MapView } from "react-native-maps";
import * as Location from "expo-location";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import Register from "./Register";

export default function Auth({ user, setUser }) {
  //--------------------(Button group)------------------------------------------
  const [selectedIndex, setSelectedIndex] = useState(1); // the element postion of the button arry
  const buttons = ["Register", "Login"]; // here to add more buttons to the group
  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <Card>
          <ButtonGroup
            onPress={setSelectedIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
          />
          <Card.Divider />

          {selectedIndex == 0 ? (
            <Register user={user} setUser={setUser} /> // Register screen
          ) : (
            <Login user={user} setUser={setUser} /> // Login screen
          )}
        </Card>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    height: responsiveScreenHeight(100),
    width: responsiveScreenWidth(100),
  },
});

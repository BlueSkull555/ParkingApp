import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import db from "../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Color from "../Color";

const { width, height } = Dimensions.get("screen");

export default function Settings({ user, setUser }) {
  const logout = () => {
    firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => logout()}
        style={{
          borderWidth: 1,
          backgroundColor: Color.black.oliver,
          width: width * 0.5,
          height: height * 0.07,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: Color.white, fontSize: 18 }}>Logout!</Text>
      </TouchableOpacity>
    </View>
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

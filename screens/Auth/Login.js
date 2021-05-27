import { StatusBar } from "expo-status-bar";
import React from "react";
import Color, { black, gray } from "../../Color";
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
import {
  ButtonGroup,
  Card,
  Input,
  Switch,
  Button,
  CheckBox,
  Overlay,
} from "react-native-elements";
import db from "../../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";

export default function Login({ user, setUser }) {
  const [email, onChangeEmail] = useState(null); // user Email
  const [password, onChangePassword] = useState(null); // user Password

  //--------------------(Handle login)------------------------------------------
  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
        console.log(userCredential.user);
        // ...
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };
  return (
    <View>
      <Input
        onChangeText={onChangeEmail}
        value={email}
        placeholder="Enter your E-Mail"
        label="Email"
        inputStyle={styles.textStyle}
        labelStyle={styles.labelStyle}
      />
      <Input
        onChangeText={onChangePassword}
        value={password}
        placeholder="Enter your password"
        secureTextEntry={true}
        label="Password"
        inputStyle={styles.textStyle}
        labelStyle={styles.labelStyle}
      />
      <Button
        disabled={password && email ? false : true}
        buttonStyle={{ backgroundColor: Color.black.oliver }}
        title="login!"
        onPress={() => handleLogin()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    margin: 10,
  },
  textStyle: {
    fontSize: 14,
  },
  labelStyle: {
    color: Color.black.oliver,
  },
});

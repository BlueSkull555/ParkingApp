import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, SafeAreaView, Alert } from 'react-native';
import db from '../db';
import { useState, useEffect } from 'react';
import firebase from "firebase/app";
import "firebase/auth";


export default function Auth({user, setUser}) {
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState(null);

  



  const handleRegister = () =>{
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('User account created & signed in!')
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!')
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!')
        }

        console.error(error);
    });
  }

  const handleLogin = () =>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      setUser(userCredential.user)
      console.log(userCredential.user)
      // ...
    })
    .catch((error) => {
      console.log(error.code)
      console.log(error.message)
    });
  }
  
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
            <View>
              <Text style={{fontWeight: 'bold', fontSize: 25, padding: 10}}>login and register!</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeEmail}
                  value={email}
                  placeholder="Enter your E-Mail here!"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={onChangePassword}
                  value={password}
                  placeholder="Enter your password here!"
                  secureTextEntry={true}
                />
                <Button
                  title="Register!"
                  onPress={() => handleRegister()}
                />
                <Button
                  title="login!"
                  onPress={() => handleLogin()}
                />
            </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    margin: 10,
  },
});
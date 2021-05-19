import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button, SafeAreaView, Alert } from 'react-native';
import db from '../db';
import { useState, useEffect } from 'react';
import firebase from "firebase/app";
import "firebase/auth";


export default function Settings({user, setUser}) {
  const logout = () =>{
    firebase.auth().signOut()
  }
    return (
      <View style={styles.container}>
      <Button
          title="logout!"
          onPress={() => logout()}
        />
    </View>
    )
    
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
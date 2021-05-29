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
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import db from "../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Icon, Switch } from "react-native-elements";
import colors from "../Colors";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRef } from "react";

import Map from "./CarpoolMap";

const { width, height } = Dimensions.get("window");
export default function CarPool(props) {
  const { currentUid, houseLocation, navigation } = props;

  const [hasCar, setHasCar] = useState(undefined);

  const save = () => {
    const doc = db.collection("users").doc(currentUid);
    doc.update({ willCarPool: hasCar });
  };

  const goToMap = () => {
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{
          //flex: 1,
          position: "absolute",
          left: 0,
          top: 0,
          width: width,
          height: height,
          zIndex: -1,
        }}
        source={require("../assets/background/lightWave2.jpg")}
      />
      <Text style={[styles.titleText]}>Welcome to Carpool</Text>

      {/* ---------------LOCATION--------------- */}
      <Text style={[styles.labelsText]}>
        Please set the location of your house
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              houseLocation === undefined ? colors.white : colors.red.light,
          },
        ]}
        onPress={goToMap}
      >
        <Text style={styles.buttonText}>Set Location</Text>
      </TouchableOpacity>

      {/* ---------------CARPOOL OPTIONS--------------- */}
      <Text style={[styles.labelsText, { marginTop: "15%" }]}>
        Do you have a car or do you need a ride?
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              hasCar === undefined
                ? colors.gray.light
                : hasCar === true
                ? "lightgray"
                : "white",
          },
        ]}
        onPress={() => setHasCar(true)}
        disabled={houseLocation === undefined}
      >
        <Text style={[styles.buttonText, {}]}>I have a car</Text>
      </TouchableOpacity>

      <Text style={[styles.labelsText, { marginTop: "5%" }]}>or</Text>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              hasCar === undefined
                ? colors.gray.light
                : hasCar === false
                ? "lightgray"
                : "white",
          },
        ]}
        onPress={() => setHasCar(false)}
        disabled={houseLocation === undefined}
      >
        <Text style={[styles.buttonText]}>I need a ride</Text>
      </TouchableOpacity>

      {/* ---------------SAVE--------------- */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.continueButton,
          {
            backgroundColor:
              houseLocation === undefined || hasCar === undefined
                ? colors.gray.light
                : colors.red.light,
          },
        ]}
        onPress={save}
        disabled={houseLocation === undefined || hasCar === undefined}
      >
        <Text style={[styles.buttonText]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    padding: "5%",
  },

  titleText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: "10%",
  },

  button: {
    borderWidth: 1,
    height: "10%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  labelsText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: "5%",
  },

  continueButton: {
    position: "absolute",
    bottom: "5%",
  },
});

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
  StatusBar,
} from "react-native";
import db from "../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Icon, Switch } from "react-native-elements";
import colors from "../Color";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRef } from "react";

import Map from "./CarpoolMap";

import Header from "./header";

const { width, height } = Dimensions.get("window");
export default function CarPool(props) {
  const { navigation, route } = props;
  const { currentUser, currentUid } = route.params;

  const houseLocation = currentUser.location;

  const [hasCar, setHasCar] = useState(undefined);

  const save = () => {
    if (hasCar !== undefined) {
      const doc = db.collection("users").doc(currentUid);
      doc.update({ willCarPool: hasCar });
      //const carpoolDoc = db.collection("carpool").doc(currentUid);
      //const chatDoc = carpoolDoc.collection("chat");
      // enabled, disabled, full
      //carpoolDoc.set({ status: "enabled", riders: [] });
      navigation.goBack();
    }
  };

  const goToMap = () => {
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container}>
      <Header
        style={{ backgroundColor: colors.black.oliver }}
        navigation={navigation}
      ></Header>
      {/* ---------------LOCATION--------------- */}
      <Text style={[styles.labelsText]}>House Location</Text>
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
        <Text style={[styles.buttonText, { color: colors.black.dark }]}>
          Set Location
        </Text>
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
                : colors.validation.succes,
          },
        ]}
        onPress={save}
        disabled={hasCar === undefined || houseLocation === undefined}
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
    // padding: "5%",
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

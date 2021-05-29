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
import { Icon, Switch, Header } from "react-native-elements";
import colors from "../Colors";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRef } from "react";

import Map from "../components/CarpoolMap";

import CarpoolFirstTime from "./carpoolFirstTime";
import WillCarPool from "./willCarPool";
import WillNotCarpool from "./willNotCarpool";

const { width, height } = Dimensions.get("window");
export default function CarPool(props) {
  const { navigation } = props;
  const currentUid = firebase.auth().currentUser.uid;
  const [currentUser, setCurrentUser] = useState(null);
  const [houseLocation, setHouseLocation] = useState(undefined);
  const [willCarPool, setWillCarPool] = useState(undefined);
  const [hasCar, setHasCar] = useState(undefined);

  useEffect(() => {
    const doc = db.collection("users").doc(currentUid);
    const observer = doc.onSnapshot((doc) => {
      const user = doc.data();
      // console.log("data", user.location);
      setCurrentUser(user);
      setHouseLocation(user.location);
      setWillCarPool(user.willCarPool);
    });
    return () => {
      observer();
    };
  }, []);

  const goToFindARide = () => {
    navigation.navigate("FindARide");
  };

  return willCarPool === undefined ? (
    <CarpoolFirstTime
      currentUid={currentUid}
      houseLocation={houseLocation}
      navigation={navigation}
    />
  ) : willCarPool === true ? (
    <WillCarPool
      currentUid={currentUid}
      navigation={navigation}
      currentUser={currentUser}
    />
  ) : (
    <WillNotCarpool
      currentUid={currentUid}
      navigation={navigation}
      currentUser={currentUser}
    />
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

  header: {
    height: height * 0.1,
    backgroundColor: colors.black.oliver,
  },

  headerIconView: {
    // borderWidth: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
  },

  headerIconButtons: {
    // borderWidth: 1,
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  body: {
    // borderWidth: 1,
    // backgroundColor: "lightgray",
    height: height * 0.835,
    width: "100%",
  },

  titleText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: "10%",
  },

  findButton: {
    borderWidth: 1,
    width: "80%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: "40%",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

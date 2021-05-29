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
  Image,
  StatusBar,
  Pressable,
  Keyboard,
} from "react-native";
import Constants from "expo-constants";
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
import { Colors } from "react-native/Libraries/NewAppScreen";

import Chat from "./chat";

const { width, height } = Dimensions.get("window");
export default function CarpoolChat(props) {
  const { style: propStyles, navigation } = props;

  const goBack = (params) => {
    navigation.goBack();
  };
  return (
    <View style={[styles.container, propStyles]}>
      <StatusBar
        // animated={true}
        backgroundColor={propStyles.backgroundColor}
        barStyle={"default"}
        // showHideTransition={statusBarTransition}
        // hidden={true}
      />
      {props.children}

      <TouchableOpacity style={styles.backIcon} onPress={goBack}>
        <Icon
          name="arrow-left"
          type="font-awesome-5"
          color={colors.black.dark}
          size={22}
        />
      </TouchableOpacity>
      <View style={styles.center} onPress={goBack}>
        <Text style={styles.title}>Settings</Text>
      </View>
    </View>
  );
}

export const testatos = (a) => {
  this.test = a;
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.1 - Constants.statusBarHeight,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight,
    // borderWidth: 1,
  },

  center: {
    // borderWidth: 1,
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  backIcon: {
    // borderWidth: 1,
    // width: "12%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    // marginRight: "5%",
    // alignSelf: "flex-start",
    left: 0,
    position: "absolute",
    padding: width * 0.03,
  },

  // ---------------TEMPLATE---------------
  templateView: {
    borderWidth: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

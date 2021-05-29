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
  FlatList,
  Image,
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

import Map from "./CarpoolMap";

import CarpoolFirstTime from "./carpoolFirstTime";

const { width, height } = Dimensions.get("window");
export default function FindARide(props) {
  const { data, currentUid } = props;

  const chatList = ({ item, index }) => {
    return (
      <View
        style={[
          styles.container,
          {
            alignSelf: item.from === currentUid ? "flex-end" : "flex-start",
            alignItems: item.from === currentUid ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View style={[styles.outerView, styles.shadow]}>
          <View style={styles.mainTextView}>
            <Text style={{ fontSize: 14 }}>{item.message}</Text>
          </View>

          {/* <View style={styles.timeView}>
          
        </View> */}
          <Text style={{ fontSize: 10 }}>3:01 PM</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={chatList}
      keyExtractor={(item) => item.id}
      style={{ transform: [{ scaleY: -1 }] }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // borderWidth: 1,
    width: "75%",
    // height: height * 0.15,
    // backgroundColor: "#fff",
    backgroundColor: "transparent",

    // justifyContent: "flex-end",
    // flexDirection: "row",
    margin: height * 0.005,
    marginLeft: height * 0.015,
    marginRight: height * 0.015,
    // marginBottom: 0,
    // padding: "3%",
    // borderRadius: 5,
    transform: [{ scaleY: -1 }],
  },

  outerView: {
    backgroundColor: "#fff",
    alignItems: "flex-end",
    // justifyContent: "center",
    // flexDirection: "row",
    // margin: height * 0.02,
    flexDirection: "row",
    marginBottom: 0,
    padding: height * 0.015,
    borderRadius: 5,
    // borderWidth: 1,
  },

  mainTextView: {
    // borderWidth: 1,
    marginRight: width * 0.02,
  },
  timeView: {
    borderWidth: 1,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
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

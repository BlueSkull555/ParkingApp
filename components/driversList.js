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
import { Colors } from "react-native/Libraries/NewAppScreen";

import CarpoolFirstTime from "./carpoolFirstTime";

const { width, height } = Dimensions.get("window");
export default function FindARide(props) {
  const { users, index, goToChat } = props;

  const driversList = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.container, styles.shadow]}
        onPress={() => goToChat(item)}
      >
        <View style={styles.leftView}>
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 50 }}
            source={{
              uri: "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
            }}
          />
        </View>
        <View style={styles.rightView}>
          <View style={styles.topRightView}>
            <Text style={styles.mainText} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.mainText} numberOfLines={1}>
              {item.distance} KM
            </Text>
          </View>

          <View style={styles.bottomRightView}>
            {/* <Text style={styles.text} numberOfLines={1}>
              {item.location.route}
            </Text> */}
            <Text style={styles.text} numberOfLines={1}>
              Land Cruiser
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={users}
      renderItem={driversList}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // borderWidth: 1,
    width: "90%",
    height: height * 0.15,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "space-between",
    alignSelf: "center",
    flexDirection: "row",
    marginTop: height * 0.02,
    padding: "3%",
    borderRadius: 5,
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

  // ---------------LEFT VIEW---------------
  leftView: {
    // borderWidth: 1,
    width: "25%",
    // height: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginRight: "3%",
  },

  // ---------------RIGHT VIEW---------------
  rightView: {
    // borderWidth: 1,
    width: "72%",
    height: "100%",
    backgroundColor: "#fff",
    // alignItems: "center",
    // paddingLeft: "5%",
    // paddingRight: "5%",
    // justifyContent: "center",
  },
  topRightView: {
    // borderWidth: 1,
    width: "100%",
    height: "40%",
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  bottomRightView: {
    // borderWidth: 1,
    width: "90%",
    height: "60%",
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    fontSize: 16,
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

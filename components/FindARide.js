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
import DriversList from "../components/driversList";
import color from "../Color";

const { width, height } = Dimensions.get("window");
export default function FindARide(props) {
  const { navigation, route } = props;
  const { currentUser, currentUid } = route.params;
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const doc = db.collection("users").where("willCarPool", "==", true);
    const observer = doc.onSnapshot((snapshot) => {
      let tempArr = [];
      snapshot.docs.map((user) => {
        const data = user.data();
        const distance = getDistanceInM(
          currentUser.location.latitude,
          currentUser.location.longitude,
          data.location.latitude,
          data.location.longitude
        );
        // console.log(
        //   "distance",
        //   currentUser.location.latitude,
        //   currentUser.location.longitude,
        //   data.location.latitude,
        //   data.location.longitude
        // );
        tempArr.push({ id: user.id, ...data, distance });
      });
      // console.log(tempArr);
      setUsers(tempArr);
    });
    return () => {
      observer();
    };
  }, []);

  // ----------------GET DISTANCE IN METER----------------
  // Haversine Formula
  const getDistanceInM = (lat1, lon1, lat2, lon2) => {
    // converts degree to radian
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180);
    };

    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    let roundedDistance = Math.round(d * 100) / 100; // Rounded to 2 decimals
    let kmToM = d * 1000;
    return roundedDistance;
  };

  const goToChat = (item) => {
    navigation.navigate("Chat", {
      otherUser: item,
      currentUser,
      isRider: true,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={color.black.oliver}
        leftComponent={
          <View style={styles.headerIconView}>
            <TouchableOpacity
              style={styles.headerIconButtons}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="arrow-left"
                type="font-awesome-5"
                color={colors.white}
                size={22}
              />
            </TouchableOpacity>
          </View>
        }
        centerComponent={{
          text: "Find a Ride",
          style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        }}
        containerStyle={styles.header}
      />
      <View style={[styles.body]}>
        {users && <DriversList users={users} goToChat={goToChat} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E5E5E5",
    // alignItems: "center",
    // justifyContent: "center",
    // padding: "5%",
  },

  header: {
    height: height * 0.1,
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
});

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
} from "react-native";
import db from "../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Icon } from "react-native-elements";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRef } from "react";

const { width, height } = Dimensions.get("window");
export default function CarPool(props) {
  const { navigation } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef();
  const GOOGLE_MAPS_APIKEY = "AIzaSyCeXWdnC6TgnudIp_sHV8pegtpC0jTA_iA";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission Denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      //   console.log("LOCATION", location);
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const doc = db.collection("users").doc(firebase.auth().currentUser.uid);
    const observer = doc.onSnapshot((doc) => {
      console.log("data", doc.data());
    });
    return () => {
      observer();
    };
  }, []);

  const onRegionChangeComplete = async (event) => {
    console.log(event);
    // const request = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_MAPS_APIKEY}&latlng=${event.latitude},${event.longitude}`
    // );

    // const json = await request.json();
    // const result = json.results[0];
    // const address_components = result.address_components;
    // let route = address_components.filter((item) =>
    //   item.types.includes("route")
    // );
    // if (route.length > 0) route = route[0].long_name;

    setSelectedLocation({
      // place_id: result.place_id,
      // formatted_address: result.formatted_address,
      // route: route !== [] ? route : "",
      latitude: event.latitude,
      longitude: event.longitude,
    });
  };

  // const onRegionChange = (event) => {
  //   console.log(event);
  // };

  const save = () => {
    // mapRef.current.animateCamera({
    //   center: {
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //   },
    //   zoom: 20,
    // });

    db.collection("users").doc(firebase.auth().currentUser.uid).update({
      location: selectedLocation,
    });
    navigation.goBack();
  };

  return (
    location && (
      <View style={styles.container}>
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          ref={mapRef}
          onRegionChangeComplete={onRegionChangeComplete}
          // onRegionChange={onRegionChange}
          showsUserLocation
        />
        <View style={[styles.iconView]}>
          <Icon
            name="map-marker-alt"
            type="font-awesome-5"
            color="black"
            size={30}
            style={{ height: "100%" }}
          />
        </View>

        <TouchableOpacity style={[styles.button]} onPress={save}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  iconView: {
    // borderWidth: 1,
    position: "absolute",
    top: "20%",
    width: "10%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: "45.5%",
  },

  button: {
    borderWidth: 1,
    position: "absolute",
    top: "20%",
    height: "10%",
    width: "70%",
    // aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    top: "80%",
  },
});

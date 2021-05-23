//@restartreset
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import db from "../db";
import { Button, Overlay } from "react-native-elements";
import firebase from "firebase/app";
import "firebase/auth";

export default function Booking() {
  const [user] = useState(firebase.auth().currentUser);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(null);
  const [extend, setExtend] = useState();

  const [parkings, setParkings] = useState([]);
  const [selectedParkings, setSelectedParkings] = useState({});

  //const [timePassed,setTimePassed] = setState()

  useEffect(() => {
    const observer = db.collection("parking").onSnapshot((querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((item) => {
        temp.push({ id: item.id, ...item.data() });
      });
      console.log("Helloooo", parkings[0]);
      setParkings(temp);
      return () => {
        observer();
      };
    });
  }, []);

  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const book = (parking) => {
    setSelectedParkings(parking);
    console.log("parking.. :", parking);
    toggleOverlay();
  };
  const submit = async () => {
    db.collection("booking").add({
      parkingId: selectedParkings.id,
      startTime: Date(),
      userId: user.uid,
      endTime: null,
    });
    await db.collection("parking").doc("0n6j5i7Z6ucmIQC7xElK").update({
      occupied: true,
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <ScrollView style={{ height: "50%" }}>
          {parkings ? (
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {parkings.map((parking, id) =>
                parking.occupied ? null : (
                  <TouchableOpacity
                    onPress={() => book(parking)}
                    style={{
                      width: "45%",
                      borderWidth: 1,
                      margin: 5,
                      padding: 5,
                    }}
                    key={id}
                  >
                    <Text>Building Number: {parking.buildingNo}</Text>
                    <View>
                      <Text>Parking Number: {parking.parkingNumber}</Text>
                      <Text>Occupied : {"" + parking.occupied}</Text>
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          ) : null}
        </ScrollView>

        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          overlayStyle={{ width: "75%", height: "85%" }}
        >
          <View>
            <Text>Building Number: {selectedParkings.buildingNo}</Text>
            <View>
              <Text>Parking Number</Text>
              <Text>{selectedParkings.parkingNumber}</Text>
              <Button onPress={() => submit()}>Book</Button>
            </View>
          </View>
        </Overlay>

        <Text>Start time</Text>
        <TextInput placeholder="type here..."></TextInput>
        <Text>End time</Text>
        <TextInput placeholder="type here..."></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

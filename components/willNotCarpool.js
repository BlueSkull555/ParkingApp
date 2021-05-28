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
import { Icon, Switch, Header } from "react-native-elements";
import colors from "../Colors";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRef } from "react";

import Map from "../components/CarpoolMap";
import { Colors } from "react-native/Libraries/NewAppScreen";

import CarpoolFirstTime from "./carpoolFirstTime";
import WillCarPool from "./willCarPool";
import ChatList from "./chatList";

const { width, height } = Dimensions.get("window");
export default function CarPool(props) {
  const { currentUid, navigation, currentUser } = props;
  const [users, setUsers] = useState(null);

  const [lastMessages, setLastMessages] = useState([]);

  const [carpoolerIds, setCarpoolerIds] = useState([]);
  const [carPoolers, setCarpoolers] = useState([]);
  const [carPoolersWithMessage, setCarpoolersWithMessage] = useState([]);
  const carpoolerIdsRef = useRef([]);
  const lastMessagesRef = useRef([]);

  // ------------------RIDER IDS------------------
  // Get Rider Id's
  useEffect(() => {
    const carpoolers = currentUser.carpoolers;
    let tempArr = [];
    carpoolers.forEach((id) => {
      tempArr.push(id);
    });
    setCarpoolerIds(tempArr);
  }, [currentUser]);

  // ------------------RIDERS------------------
  // Get Rider Details through the profile
  useEffect(() => {
    if (carpoolerIds.length > 0) {
      const doc = db
        .collection("users")
        .where(firebase.firestore.FieldPath.documentId(), "in", carpoolerIds);
      const observer = doc.onSnapshot((onSnapshot) => {
        let tempArr = [];
        onSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          tempArr.push({ id: doc.id, ...data });
        });
        // console.log("WHY ARE YU NOT GETTING SET?", tempArr);
        setCarpoolers([...tempArr]);
      });
      return () => {
        observer();
      };
    }
  }, [carpoolerIds]);

  // ------------------CHATS------------------
  // Get chats then get the last message for each rider
  // useEffect(() => {
  //   const doc = db.collection("carpool").doc(currentUid);

  //   const chatsDoc = doc.collection("chats");
  //   const observer = chatsDoc.onSnapshot((onSnapshot) => {
  //     let tempArr = [];
  //     const ids = carpoolerIdsRef.current;
  //     console.log(ids);
  //     if (ids.length > 0) {
  //       ids.forEach((id) => {
  //         let lastMessage = onSnapshot.docs.filter(
  //           (doc) => doc.data().userId === id
  //         );

  //         lastMessage = lastMessage.sort(
  //           (a, b) => b.data().createdAt - a.data().createdAt
  //         );
  //         // lastMessage = lastMessage.sort((a, b) => a.createdAt - b.createdAt);
  //         // console.log(lastMessage[0].data());
  //         if (lastMessage && lastMessage[0] && lastMessage[0].data())
  //           tempArr.push(lastMessage[0].data());
  //       });
  //     }
  //     setLastMessages(tempArr);
  //     // setRiders(tempArr);
  //   });
  //   return () => {
  //     observer();
  //   };
  // }, []);

  useEffect(() => {
    if (carpoolerIds.length > 0) {
      // const ids = carpoolerIdsRef.current;
      let tempArr = [];
      let observerArr = [];
      console.log("BB PLS IDS", carpoolerIds);
      carpoolerIds.forEach((id, index) => {
        console.log("7bb", id);
        const carpoolDoc = db.collection("carpool").doc(id);
        const chatDoc = carpoolDoc.collection("chats");
        const observer = chatDoc.onSnapshot((onSnapshot) => {
          console.log("HABIBI GIVE ME NUMBER", onSnapshot.size);
          onSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            tempArr.push({ id: doc.id, carpoolerId: id, ...data });
            // lastMessagesRef.current.push()
            if (index === tempArr.length - 1) {
              setLastMessages([...tempArr]);
            }
          });
        });

        observerArr.push(observer);
      });
      console.log("PLS HABIBI", tempArr);

      return () => {
        observerArr.forEach((observer) => observer());
      };
    }
  }, [carpoolerIds]);

  useEffect(() => {
    console.log("LAST MESSAGO", lastMessages);
    console.log("RIDERS ASJKHDSADHHASFJSLKDASJ", carPoolers);
    if (carPoolers.length > 0 && lastMessages.length > 0) {
      // console.log("WE INSIDE THIS ASJKHDSADHHASFJSLKDASJ");
      let tempArr = [];
      carPoolers.forEach((carpooler) => {
        const lastMessage = lastMessages.filter(
          (message) => message.carpoolerId === carpooler.id
        )[0];
        // console.log("LAST MESSAGO", lastMessage);
        // console.log("riderino", rider);
        const newCarpooler = { lastMessage, ...carpooler };
        // console.log("riderino", newRider);
        tempArr.push(newCarpooler);
      });
      console.log("TEMPARINO", tempArr);
      setCarpoolersWithMessage(tempArr);
    }
  }, [carPoolers, lastMessages]);

  const goToChat = (item) => {
    console.log("hello");
    navigation.navigate("Chat", {
      currentUser,
      currentUid,
      otherUser: item,
      isRider: true,
    });
  };

  const goToFindARide = () => {
    navigation.navigate("FindARide", { currentUser, currentUid });
  };

  const goToSettings = () => {
    navigation.navigate("Settings", { currentUser, currentUid });
  };

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{
          text: "Carpool",
          style: { color: colors.white, fontSize: 20 },
        }}
        // centerComponent={{ text: "MY TITLE", style: { color: "#fff" } }}
        rightComponent={
          <View style={styles.headerIconView}>
            <TouchableOpacity
              style={styles.headerIconButtons}
              onPress={goToSettings}
            >
              <Icon
                name="settings-sharp"
                type="ionicon"
                color={colors.white}
                size={22}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButtons}>
              <Icon
                name="ios-person-add-sharp"
                type="ionicon"
                color={colors.white}
                size={22}
              />
            </TouchableOpacity>
          </View>
        }
        containerStyle={styles.header}
      />
      <View style={[styles.body]}>
        <Text>Will not Carpool Ride</Text>
        {carPoolersWithMessage ? (
          <ChatList users={carPoolersWithMessage} goToChat={goToChat} />
        ) : (
          <TouchableOpacity style={[styles.findButton]} onPress={goToFindARide}>
            <Text style={styles.buttonText}>Find a Ride</Text>
          </TouchableOpacity>
        )}
      </View>
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

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

import ChatList from "./chatList";

const { width, height } = Dimensions.get("window");
export default function CarPool(props) {
  const { currentUid, navigation, currentUser } = props;
  const [riders, setRiders] = useState([]);
  const [riderIds, setRiderIds] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [ridersWithMessage, setRidersWithMessage] = useState([]);

  const riderIdsRef = useRef([]);

  // ------------------RIDER IDS------------------
  // Get Rider Id's
  useEffect(() => {
    const doc = db.collection("carpool").doc(currentUid);
    const observer = doc.onSnapshot((doc) => {
      console.log("doc exists?", doc.exists);
      if (doc.exists) {
        const data = doc.data();
        console.log("data.riders", data.riders);
        setRiderIds(data.riders);
        riderIdsRef.current = data.riders;
      }
    });
    return () => {
      observer();
    };
  }, []);

  // ------------------RIDERS------------------
  // Get Rider Details through the profile
  useEffect(() => {
    if (riderIds.length > 0) {
      const doc = db
        .collection("users")
        .where(firebase.firestore.FieldPath.documentId(), "in", riderIds);
      const observer = doc.onSnapshot((onSnapshot) => {
        let tempArr = [];
        onSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          tempArr.push({ id: doc.id, ...data });
        });
        // console.log("WHY ARE YU NOT GETTING SET?", tempArr);
        setRiders([...tempArr]);
      });
      return () => {
        observer();
      };
    }
  }, [riderIds]);

  // ------------------CHATS------------------
  // Get chats then get the last message for each rider
  useEffect(() => {
    const doc = db.collection("carpool").doc(currentUid);

    const chatsDoc = doc.collection("chats");
    const observer = chatsDoc.onSnapshot((onSnapshot) => {
      onSnapshot.docs.forEach((item) =>
        console.log("FUCKIN BITCH", item.data())
      );
      if (!onSnapshot.empty) {
        console.log("onSnapshot.empty", onSnapshot.empty);
        let tempArr = [];
        const ids = riderIdsRef.current;
        console.log(ids);
        if (ids.length > 0) {
          // console.log("ARE WE IN THIS BITCH?", ids);
          // console.log("ARE WE IN THIS BITCH?", lastMessages.doc);
          ids.forEach((id) => {
            let lastMessage = onSnapshot.docs.filter(
              (doc) => doc.data().userId === id
            );

            lastMessage = lastMessage.sort(
              (a, b) => b.data().createdAt - a.data().createdAt
            );

            // lastMessage.forEach((item) => console.log("fuuuuck", item));
            // lastMessage = lastMessage.sort((a, b) => a.createdAt - b.createdAt);
            // console.log(lastMessage[0].data());
            // if (lastMessage && lastMessage[0] && lastMessage[0].data())
            tempArr.push(lastMessage[0].data());
          });
        }
        setLastMessages(tempArr);
        // setRiders(tempArr);
      }
    });
    return () => {
      observer();
    };
  }, []);

  useEffect(() => {
    // console.log("LAST MESSAGO", lastMessages);
    // console.log("RIDERS ASJKHDSADHHASFJSLKDASJ", riders);
    if (riders.length > 0 && lastMessages.length > 0) {
      // console.log("WE INSIDE THIS ASJKHDSADHHASFJSLKDASJ");
      let tempArr = [];
      riders.forEach((rider) => {
        const lastMessage = lastMessages.filter(
          (message) => message.userId === rider.id
        )[0];
        // console.log("LAST MESSAGO", lastMessage);
        // console.log("riderino", rider);
        const newRider = { lastMessage, ...rider };
        // console.log("riderino", newRider);
        tempArr.push(newRider);
      });
      // console.log("TEMPARINO", tempArr);
      setRidersWithMessage(tempArr);
    }
  }, [riders, lastMessages]);

  const goToChat = (item) => {
    console.log("hello");
    navigation.navigate("Chat", {
      currentUser,
      currentUid,
      otherUser: item,
      isRider: false,
    });
  };

  const goToSettings = () => {
    navigation.navigate("Settings", { currentUser, currentUid });
  };

  const removeAll = () => {
    // const doc = db.collection("carpool").doc(currentUid).delete();
    // console.log("waht");
    // setRiders([]);
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
            {/* <TouchableOpacity style={styles.headerIconButtons}>
              <Icon
                name="ios-person-add-sharp"
                type="ionicon"
                color={colors.white}
                size={22}
              />
            </TouchableOpacity> */}
          </View>
        }
        containerStyle={styles.header}
      />
      <View style={[styles.body]}>
        <Text>Will Car Pool BRO</Text>
        <Button title="Remove all carpool" onPress={removeAll} />
        <ChatList users={ridersWithMessage} goToChat={goToChat} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
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
    justifyContent: "flex-end",
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

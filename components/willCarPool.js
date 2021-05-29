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
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [usersWithMessage, setUsersWithMessage] = useState([]);
  const [fromChats, setFromChats] = useState([]);
  const [toChats, setToChats] = useState([]);

  useEffect(() => {
    const chatIds = currentUser.chats;
    if (chatIds.length > 0) {
      const userDoc = db
        .collection("users")
        .where(firebase.firestore.FieldPath.documentId(), "in", chatIds);

      const observer = userDoc.onSnapshot((onSnapshot) => {
        let tempArr = [];
        onSnapshot.docs.forEach((doc) => {
          tempArr.push({ id: doc.id, ...doc.data() });
        });
        setUsers(tempArr);
      });

      return () => {
        observer();
      };
    }
  }, []);

  useEffect(() => {
    const fromDocs = db.collection("chats").where("from", "==", currentUid);
    const fromObserver = fromDocs.onSnapshot((onSnapshot) => {
      let tempArr = [];
      onSnapshot.docs.forEach((doc) => {
        tempArr.push({ id: doc.id, ...doc.data() });
      });
      // console.log(tempArr);
      setFromChats(tempArr);
    });

    const toDocs = db.collection("chats").where("to", "==", currentUid);
    const toObserver = toDocs.onSnapshot((onSnapshot) => {
      let tempArr = [];
      onSnapshot.docs.forEach((doc) => {
        tempArr.push({ id: doc.id, ...doc.data() });
      });
      // console.log(tempArr);
      setToChats(tempArr);
    });

    return () => {
      fromObserver();
      toObserver();
    };
  }, []);

  useEffect(() => {
    let tempArr = [...fromChats, ...toChats];
    setChats(tempArr);
  }, [fromChats, toChats]);

  useEffect(() => {
    if (users.length > 0 && chats.length > 0) {
      let tempArr = [];
      users.forEach((user) => {
        let lastMessage = chats.filter(
          (chat) =>
            (chat.from === user.id && chat.to === currentUid) ||
            (chat.from === currentUid && chat.to === user.id)
        );
        lastMessage = lastMessage.sort((a, b) => b.createdAt - a.createdAt);
        if (lastMessage.length > 0) {
          tempArr.push({ ...user, lastMessage: lastMessage[0] });
        } else {
          tempArr.push({ ...user });
        }
      });
      // console.log(tempArr);
      setUsersWithMessage(tempArr);
    }
  }, [users, chats]);

  const goToChat = (item) => {
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

  const removeAll = () => {};

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
        {/* <Text>Will Car Pool BRO</Text> */}
        {/* <Button title="Remove all carpool" onPress={removeAll} /> */}
        {usersWithMessage.length > 0 ? (
          <ChatList users={usersWithMessage} goToChat={goToChat} />
        ) : (
          <View style={[styles.findButton]}>
            <Text style={styles.buttonText}>
              Waiting for users to request for a carpool
            </Text>
          </View>
        )}
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

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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Constants from "expo-constants";
import db from "../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { Icon, Switch, Header } from "react-native-elements";
import colors from "../Colors";

import { useKeyboard } from "@react-native-community/hooks";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRef } from "react";

import Map from "../components/CarpoolMap";
import { Colors } from "react-native/Libraries/NewAppScreen";

import Chat from "./chat";

const { width, height } = Dimensions.get("window");
export default function CarpoolChat(props) {
  const { navigation, route } = props;
  const { currentUser, otherUser, isRider } = route.params;
  const currentUid = firebase.auth().currentUser.uid;

  const keyboard = useKeyboard();
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [fromChats, setFromChats] = useState([]);
  const [toChats, setToChats] = useState([]);

  useEffect(() => {
    const fromDocs = db
      .collection("chats")
      .where("from", "==", currentUid)
      .where("to", "==", otherUser.id);
    const fromObserver = fromDocs.onSnapshot((onSnapshot) => {
      let tempArr = [];
      onSnapshot.docs.forEach((doc) => {
        tempArr.push({ id: doc.id, ...doc.data() });
      });
      console.log(tempArr);
      setFromChats(tempArr);
    });

    const toDocs = db
      .collection("chats")
      .where("from", "==", otherUser.id)
      .where("to", "==", currentUid);
    const toObserver = toDocs.onSnapshot((onSnapshot) => {
      let tempArr = [];
      onSnapshot.docs.forEach((doc) => {
        tempArr.push({ id: doc.id, ...doc.data() });
      });
      console.log(tempArr);
      setToChats(tempArr);
    });

    return () => {
      fromObserver();
      toObserver();
    };
  }, []);

  useEffect(() => {
    let tempArr = [...fromChats, ...toChats];
    tempArr.sort((a, b) => b.createdAt - a.createdAt);
    setChats(tempArr);
  }, [fromChats, toChats]);

  const send = async () => {
    const chatIds = currentUser.chats;
    const countFilteredChatIds = chatIds.filter(
      (id) => otherUser.id === id
    ).length;
    console.log(countFilteredChatIds);

    if (countFilteredChatIds < 1) {
      db.collection("users")
        .doc(currentUid)
        .update({ chats: [otherUser.id] }, { merge: true });

      db.collection("users")
        .doc(otherUser.id)
        .update({ chats: [currentUid] }, { merge: true });
    }

    const chatDoc = db.collection("chats");
    chatDoc.add({
      from: currentUid,
      to: otherUser.id,
      message: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setChats([
      ...chats,
      {
        from: currentUid,
        to: otherUser.id,
        message: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
    ]);

    setText("");
  };

  const goBack = (params) => {
    navigation.goBack();
  };

  return (
    <View
      style={styles.container}
      onPress={Keyboard.dismiss}
      android_disableSound
    >
      <StatusBar
        // animated={true}
        backgroundColor="black"
        barStyle={"default"}
        // showHideTransition={statusBarTransition}
        // hidden={true}
      />

      {/* ---------------HEADER--------------- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={goBack}>
          <Icon
            name="arrow-left"
            type="font-awesome-5"
            color={colors.black.dark}
            size={22}
          />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 50 }}
            source={{
              uri: "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
            }}
          />
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>{otherUser.name}</Text>
        </View>
      </View>

      <View
        style={[
          styles.body,
          {
            flex: 1,
            marginBottom:
              Platform.OS === "ios"
                ? keyboard.keyboardShown
                  ? keyboard.keyboardHeight - height * 0.09
                  : 0
                : 0,
          },
        ]}
      >
        {/* <Text>{otherUser.email}aaaaaaa</Text> */}
        <Chat data={chats} currentUid={currentUid} />

        <TouchableOpacity
          style={styles.textInputView}
          onPress={send}
          disabled={text === ""}
        >
          <TextInput
            style={[styles.textInput]}
            value={text}
            onChangeText={setText}
            // onFocus={() => setContainerSize(keyboard.keyboardHeight)}
          />
          <View style={styles.iconView}>
            <Icon name="send" type="ionicons" color={"white"} size={18} />
          </View>
        </TouchableOpacity>
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
    // marginTop: Constants.statusBarHeight,
  },

  header: {
    height: height * 0.1 - Constants.statusBarHeight,
    width: "100%",
    // backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    // borderWidth: 1,
    borderBottomWidth: 1,
    marginTop: Constants.statusBarHeight,
  },

  headerTitle: {
    // borderWidth: 1,
    width: "50%",
    height: "100%",
    backgroundColor: "transparent",
    // alignItems: "center",
    justifyContent: "center",
    // marginRight: "5%",
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  backIcon: {
    // borderWidth: 1,
    width: "12%",
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "5%",
  },

  avatar: {
    // borderWidth: 1,
    // width: "10%",
    height: "80%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "5%",
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

    width: "100%",
  },

  textInputView: {
    // borderWidth: 1,
    width: "100%",
    height: height * 0.05,
    backgroundColor: "white",
    flexDirection: "row",
    padding: height * 0.005,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    width: "90%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingLeft: width * 0.03,
    paddingRight: width * 0.03,
  },
  iconView: {
    // borderWidth: 1,
    // width: "10%",
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "lightblue",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
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

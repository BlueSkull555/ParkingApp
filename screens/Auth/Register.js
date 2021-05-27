import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
} from "react-native";
import {
  ButtonGroup,
  Card,
  Input,
  Switch,
  Button,
  CheckBox,
  Overlay,
} from "react-native-elements";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import db from "../../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { TouchableOpacity } from "react-native";

export default function Register({ user, setUser }) {
  //--------------------(database variable)------------------------------------------
  const [email, onChangeEmail] = useState(null); // user Email
  const [password, onChangePassword] = useState(null); // user password
  const [name, onChangeName] = useState(null); // user name
  const [age, onChangeAge] = useState(null); // user age
  const [phone, onChangePhone] = useState(null); // user phone number
  const [collegeId, onChangeCollegeId] = useState(null); // user college id
  const [gender, onChangeGender] = useState(null); // user gender

  //------------(FLAG)----------------------------------------------------------------
  const [viewFlag, setViewFlag] = useState("first"); // next pages
  const [haveCar, onChangeHaveCar] = useState(null);
  //----------------------------------------------------------------------------

  const [brand, onChangeBrand] = useState(null);
  const [model, onChangeModel] = useState(null);
  const [plateNo, onChangePlateNo] = useState(null);
  //--------------------(Handle register)------------------------------------------
  const handleRegister = () => {
    if (
      !(email || password || name || age || phone || collegeId || gender) ||
      haveCar === true ||
      haveCar === null
    ) {
      Alert.alert("Please fill all inputs");
      console.log(email, password, name, age, phone, collegeId, gender);
    } else if (
      haveCar === true &&
      email &&
      password &&
      name &&
      age &&
      phone &&
      collegeId &&
      gender &&
      brand &&
      plateNo &&
      model
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").doc(firebase.auth().currentUser.uid).set({
            name,
            age,
            email,
            phone,
            collegeId,
            gender,
            role: "user",
            car: { brand, plateNo, model },
          });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            Alert.alert("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            Alert.alert("That email address is invalid!");
          }
          console.error(error);
        });
    } else if (
      haveCar === false &&
      email &&
      password &&
      name &&
      age &&
      phone &&
      collegeId &&
      gender
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").doc(firebase.auth().currentUser.uid).set({
            name,
            age,
            email,
            phone,
            collegeId,
            gender,
            role: "user",
            car: null,
          });
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            Alert.alert("That email address is already in use!");
          }

          if (error.code === "auth/invalid-email") {
            Alert.alert("That email address is invalid!");
          }
          console.error(error);
        });
    }
  };
  return (
    <View>
      {viewFlag === "first" ? (
        <View>
          <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
            <Input
              containerStyle={{ width: responsiveScreenWidth(40) }}
              onChangeText={onChangeName}
              value={name}
              placeholder="Enter your name"
              label="Name"
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(40) }}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Enter your E-Mail!"
              label="Email"
              secureTextEntry={false}
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(40) }}
              onChangeText={onChangePassword}
              value={password}
              placeholder="Enter your password"
              secureTextEntry={true}
              label="Password"
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(40) }}
              onChangeText={onChangePhone}
              value={phone}
              placeholder="Enter your phone"
              keyboardType="number-pad"
              label="Phone number"
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(40) }}
              onChangeText={onChangeAge}
              value={age}
              placeholder="Enter your age"
              keyboardType="number-pad"
              label="Age"
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(40) }}
              onChangeText={onChangeCollegeId}
              value={collegeId}
              placeholder="Enter your college ID"
              keyboardType="number-pad"
              label="College ID"
            />
            <View
              style={{ width: "100%", marginBottom: 5, flexDirection: "row" }}
            >
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    color: "grey",
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  Select gender
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    center
                    title="♂"
                    checked={gender === "Male"}
                    onPress={() => onChangeGender("Male")}
                    containerStyle={{
                      margin: 0,
                      padding: 0,
                    }}
                    textStyle={{ fontSize: 20 }}
                  />
                  <CheckBox
                    center
                    title="♀"
                    checked={gender === "Female"}
                    onPress={() => onChangeGender("Female")}
                    containerStyle={{
                      margin: 0,
                      padding: 0,
                    }}
                    textStyle={{ fontSize: 20 }}
                  />
                </View>
              </View>
              <View style={{ width: "50%" }}>
                <Text
                  style={{
                    color: "grey",
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  you have car ?
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    center
                    title="Yes"
                    checked={haveCar === true}
                    onPress={() => onChangeHaveCar(true)}
                    containerStyle={{
                      margin: 0,
                      padding: 0,
                    }}
                    textStyle={{ fontSize: 20 }}
                  />
                  <CheckBox
                    center
                    title="No"
                    checked={haveCar === false}
                    onPress={() => onChangeHaveCar(false)}
                    containerStyle={{
                      margin: 0,
                      padding: 0,
                    }}
                    textStyle={{ fontSize: 20 }}
                  />
                </View>
              </View>
            </View>
          </View>
          {haveCar === true ? (
            <Button title="Next" onPress={() => setViewFlag("second")} />
          ) : (
            <Button title="Register" onPress={() => handleRegister()} />
          )}
        </View>
      ) : viewFlag === "second" ? (
        <View
          style={{
            justifyContent: "space-between",
            height: responsiveScreenHeight(35),
          }}
        >
          <Pressable
            onPress={Keyboard.dismiss}
            style={{
              alignSelf: "center",
              justifyContent: "center",
              flex: 1,
            }}
            style={{ flexWrap: "wrap", flexDirection: "row" }}
          >
            <Input
              containerStyle={{ width: responsiveScreenWidth(38) }}
              onChangeText={onChangePlateNo}
              value={plateNo}
              placeholder="Enter your plate"
              keyboardType="numeric"
              label="Plate number"
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(38) }}
              onChangeText={onChangeBrand}
              value={brand}
              placeholder="Enter your brand"
              keyboardType="default"
              label="Brand"
            />
            <Input
              containerStyle={{ width: responsiveScreenWidth(38) }}
              onChangeText={onChangeModel}
              value={model}
              placeholder="Enter your model"
              keyboardType="default"
              label="Model"
            />
          </Pressable>
          <Button title="Back" onPress={() => setViewFlag("first")} />
          <Button title="Register!" onPress={() => handleRegister()} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    margin: 10,
  },
});

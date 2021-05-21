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
} from "react-native";
import db from "../db";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {
  ButtonGroup,
  Card,
  Input,
  Switch,
  Button,
  CheckBox,
  Overlay,
} from "react-native-elements";
import { MapView } from "react-native-maps";
import * as Location from "expo-location";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";

export default function Auth({ user, setUser }) {
  //--------------------(database variable)------------------------------------------
  const [email, onChangeEmail] = useState(null); // user Email
  const [password, onChangePassword] = useState(null); // user password
  const [name, onChangeName] = useState(null); // user name
  const [age, onChangeAge] = useState(null); // user age
  const [phone, onChangePhone] = useState(null); // user phone number
  const [collegeId, onChangeCollegeId] = useState(null); // user college id
  const [gender, onChangeGender] = useState(null); // user gender

  //----------------------------------------------------------------------------

  const [carSwtich, onChangeCarSwitch] = useState(false);
  const [brand, onChangeBrand] = useState(null);
  const [model, onChangeModel] = useState(null);
  const [plateNo, onChangePlateNo] = useState(null);

  //--------------------(Button group)------------------------------------------
  const [selectedIndex, setSelectedIndex] = useState(1); // the element postion of the button arry
  const buttons = ["Register", "Login"]; // here to add more buttons to the group
  //----------------------------------------------------------------------------

  //--------------------(Radio button)------------------------------------------
  var radio_props = [
    { label: "Male  ", value: 0 },
    { label: "Female", value: 1 },
  ];

  const radioFlag = (value) => {
    if (value === 0) {
      onChangeGender("Male");
    } else {
      onChangeGender("Female");
    }
  };
  //----------------------------------------------------------------------------

  //--------------------(Handle register)------------------------------------------
  const handleRegister = () => {
    if (
      !(email || password || name || age || phone || collegeId || gender) ||
      (Switch && (!brand || !plateNo || !model))
    ) {
      Alert.alert("Please fill all inputs");
      console.log(email, password, name, age, phone, collegeId, gender);
    } else if (Switch) {
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
    } else {
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
            car,
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
  //----------------------------------------------------------------------------

  //--------------------(Handle login)------------------------------------------
  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
        console.log(userCredential.user);
        // ...
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };
  //----------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Card>
        <ButtonGroup
          onPress={setSelectedIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
        />
        <Card.Divider />

        {selectedIndex == 0 ? (
          // Register screen -----------------------------------------------------------------------
          <View>
            <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
              <Input
                containerStyle={{ width: "48%" }}
                onChangeText={onChangeName}
                value={name}
                placeholder="Enter your name"
                label="Name"
              />
              <Input
                containerStyle={{ width: "48%" }}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Enter your E-Mail!"
                label="Email"
                secureTextEntry={false}
              />
              <Input
                containerStyle={{ width: "48%" }}
                onChangeText={onChangePassword}
                value={password}
                placeholder="Enter your password"
                secureTextEntry={true}
                label="Password"
              />
              <Input
                containerStyle={{ width: "48%" }}
                onChangeText={onChangePhone}
                value={phone}
                placeholder="Enter your phone"
                keyboardType="number-pad"
                label="Phone number"
              />
              <Input
                containerStyle={{ width: "48%" }}
                onChangeText={onChangeAge}
                value={age}
                placeholder="Enter your age"
                keyboardType="number-pad"
                label="Age"
              />
              <Input
                containerStyle={{ width: "48%" }}
                onChangeText={onChangeCollegeId}
                value={collegeId}
                placeholder="Enter your college ID"
                keyboardType="number-pad"
                label="College ID"
              />
            </View>
            <View
              style={{ justifyContent: "space-around", flexDirection: "row" }}
            >
              <View>
                <Text
                  style={{ color: "grey", fontWeight: "bold", marginBottom: 5 }}
                >
                  Select gender
                </Text>
                <RadioForm
                  radio_props={radio_props}
                  initial={null}
                  onPress={radioFlag}
                  formHorizontal={true}
                />
              </View>
              <View style={{}}>
                <Text
                  style={{ color: "grey", fontWeight: "bold", marginBottom: 5 }}
                >
                  You have a car?
                </Text>
                <Switch value={carSwtich} onValueChange={onChangeCarSwitch} />
              </View>
            </View>
            {carSwtich == true ? (
              <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                <Input
                  containerStyle={{ width: "48%" }}
                  onChangeText={onChangePlateNo}
                  value={plateNo}
                  placeholder="Enter your plate"
                  keyboardType="number-pad"
                  label="Plate number"
                />
                <Input
                  containerStyle={{ width: "48%" }}
                  onChangeText={onChangeBrand}
                  value={brand}
                  placeholder="Enter your brand"
                  keyboardType="number-pad"
                  label="Brand"
                />
                <Input
                  containerStyle={{ width: "48%" }}
                  onChangeText={onChangeModel}
                  value={model}
                  placeholder="Enter your model"
                  keyboardType="number-pad"
                  label="Model"
                />
              </View>
            ) : null}
            <Button title="Register!" onPress={() => handleRegister()} />
          </View>
        ) : (
          // Login screen ------------------------------------------------------------------------------------
          <View>
            <Input
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Enter your E-Mail"
              label="Email"
            />
            <Input
              onChangeText={onChangePassword}
              value={password}
              placeholder="Enter your password"
              secureTextEntry={true}
              label="Password"
            />
            <Button title="login!" onPress={() => handleLogin()} />
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

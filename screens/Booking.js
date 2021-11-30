//@refreshreset
import React, { useState, useEffect, Component } from "react";
import Color from "../Color";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from "react-native";
import db from "../db";
//import Header from "../components/header";
import {
  Text,
  Button,
  Overlay,
  SearchBar,
  Icon,
  Header,
  Divider,
  Tooltip,
} from "react-native-elements";
import firebase from "firebase/app";
import "firebase/auth";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default function Booking() {
  //--------------------(General variable)------------------------------------------
  const [user] = useState(firebase.auth().currentUser);
  const [parkings, setParkings] = useState([]);
  const [searchedParkings, setSearchedParkings] = useState([]);
  const [selectedParkings, setSelectedParkings] = useState({});
  const [visible, setVisible] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownabooking, setOwnabooking] = useState([]);
  const [view, setView] = useState("");
  const [details, setDetails] = useState("");
  const [search, setSearch] = useState("");
  const [prediction, setPrediction] = useState("Loading");

  //---------------------------------------------------------------------------------
  //--------------------(Machine Learning Predictions)--------------------------------------
  useEffect(() => {
    getPrediction();
  }, []);

  const getPrediction = async () => {
    const dateNow = moment();
    const hourNow = dateNow.format("HH");
    let dayNow = dateNow.day();

    if (dayNow > 4 || parseInt(hourNow) < 7 || parseInt(hourNow) > 20) {
      setPrediction("N/A");
      return;
    }
    dayNow = dateNow.day() + 1 > 6 ? 0 : dateNow.day() + 1;

    // const url = "http://192.168.0.17:3000";
    const url = "https://parkingappbackend.herokuapp.com/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: dayNow,
        hour: hourNow,
      }),
    });
    if (response.ok) {
      const occupied = await response.json();
      const available = 300 - occupied;
      const range = 25;
      const minPred = available - range < 0 ? 0 : available - range;
      const maxPred =
        available + range > 300
          ? 300
          : available + range < 0
          ? 25
          : available + range;
      setPrediction(`${minPred} - ${maxPred}`);
    } else {
      Alert.alert("Error", "Unable to get estimate parking spots", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  //---------------------------------------------------------------------------------
  //--------------------(Snapshot for parkings)--------------------------------------
  useEffect(() => {
    setLoading(true);

    const observer = db.collection("parking").onSnapshot((querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((item) => {
        temp.push({ id: item.id, ...item.data() });
      });
      setParkings(temp);
      setSearchedParkings(temp);
      setLoadingButton(false);
      setVisible(false);
    });
    return () => {
      observer();
    };
  }, []);
  useEffect(() => {
    const checking = db
      .collection("booking")
      .where("userId", "==", user.uid)
      .onSnapshot((querySnapshot) => {
        let tempAr = [];
        querySnapshot.forEach((temp) =>
          tempAr.push({ id: temp.id, ...temp.data() })
        );

        setOwnabooking(tempAr);
        setLoading(false);
      });
    return () => {
      checking();
    };
  }, []);

  //---------------------------------------------------------------------------------
  //----------------------------(Public Methods)-------------------------------------

  const handleSearch = (input) => {
    if (input == "") {
      setSearchedParkings(parkings);
    } else {
      let test = parkings.filter((pa) => pa.parkingNumber == input);
      setSearchedParkings(test);
    }
  };
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  //----------------------------(Main Booking Methods)--------------------------------
  const handleDetails = (bo, pa) => {
    let p = { par: pa, ...bo };
    setDetails(p);
    toggleOverlay();
  };
  const book = (p) => {
    setSelectedParkings(p);
    console.log("parking.. :", p);
    toggleOverlay();
  };
  const submit = async () => {
    setLoadingButton(true);
    db.collection("booking").add({
      parkingId: selectedParkings.id,
      startTime: moment().format("LLL"),
      expireDate: moment().add(30, "minute").format("LLL"),
      userId: user.uid,
      endTime: null,
      extended: false,
      status: "Active",
    });
    await db.collection("parking").doc(selectedParkings.id).update({
      occupied: true,
    });
  };

  const extendRes = () => {
    let newTime = moment(details.expireDate).add(30, "minute").format("LLL");
    db.collection("booking").doc(details.id).update({
      extended: true,
      expireDate: newTime,
      status: "Extended",
    });
    setVisible(false);
  };

  const cancelRes = async () => {
    await db
      .collection("parking")
      .doc(details.parkingId)
      .update({
        occupied: false,
      })
      .then(() => {
        db.collection("booking").doc(details.id).delete();
      });

    setVisible(false);
  };
  //---------------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/background/lightWave2.jpg")}
      />
      {/* <Header style={{ backgroundColor: Color.black.oliver }}>
        <View style={{ flexDirection: "row" }}>
          <SearchBar
            lightTheme
            containerStyle={{
              backgroundColor: "transparent",
              borderTopWidth: 0,
              borderBottomWidth: 0,
              width: "100%",
            }}
            placeholder="Parking Number"
            onChangeText={(text) => {
              setSearch(text), handleSearch(text);
            }}
            value={search}
          />
        </View>
      </Header> */}
      <Header
        elevated
        barStyle={"light-content"}
        statusBarProps={{ backgroundColor: Color.black.oliver }}
        placement="left"
        containerStyle={styles.Header}
        leftContainerStyle={styles.leftComponent}
        rightContainerStyle={styles.rightComponent}
        leftComponent={
          view == "1" ? (
            <Icon
              type="material-community"
              name="arrow-left"
              color={Color.white}
              onPress={() => setView("")}
              size={40}
            />
          ) : null
        }
        centerComponent={
          <SearchBar
            lightTheme
            inputContainerStyle={{
              height: "100%",
              backgroundColor: Color.white,
            }}
            containerStyle={{
              backgroundColor: "transparent",
              borderTopWidth: 0,
              borderBottomWidth: 0,
              width: "100%",
              paddingTop: -10,
            }}
            placeholder="Parking Number"
            onChangeText={(text) => {
              setSearch(text), handleSearch(text);
            }}
            value={search}
          />
        }
        rightComponent={
          <Icon
            size={34}
            containerStyle={{
              justifyContent: "center",
              alignContent: "center",
              paddingRight: 5,
            }}
            type="evilicon"
            name="archive"
            color="#fff"
            onPress={() => setView("1")}
          />
        }
      />

      <View
        style={{
          width: "90%",
          height: height * 0.1,
          borderWidth: 1,
          backgroundColor: Color.white,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: height * 0.005,
            right: width * 0.01,
            zIndex: 100,
          }}
        >
          <Tooltip
            popover={
              <Text style={{ color: "white" }}>
                Estimated parking spots will only show during weekdays from 7AM
                to 8PM
              </Text>
            }
            width={width * 0.8}
            backgroundColor={Color.black.oliver}
          >
            <Icon name="infocirlceo" type="antdesign" color="black" size={16} />
          </Tooltip>
        </View>
        <Text style={{ fontSize: 16, marginLeft: width * 0.02 }}>
          Estimated Available Parking Spots
        </Text>
        <View
          style={{
            // borderWidth: 1,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>{prediction}</Text>
        </View>
      </View>

      {view == "1" ? (
        <ScrollView style={styles.ScrollView}>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {parkings && ownabooking && loading == false ? (
              ownabooking.map((item, id) => (
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                  key={id}
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleDetails(
                        item,
                        parkings.filter((pa) => pa.id == item.parkingId)[0]
                      )
                    }
                    style={{
                      alignSelf: "center",
                      width: "90%",
                      borderWidth: 1,
                      borderColor: Color.gray.light,
                      padding: 2,
                      margin: 5,
                      backgroundColor: Color.white,
                    }}
                  >
                    {parkings.filter((pa) => pa.id == item.parkingId) ? (
                      <View style={{ padding: 5, flexDirection: "row" }}>
                        <View style={{ padding: 5 }}>
                          <Text style={{ color: Color.gray.dark }}>
                            Expire Date:
                          </Text>
                          <Text style={{ color: Color.gray.dark }}>
                            Parking Number:
                          </Text>
                          <Text style={{ color: Color.gray.dark }}>
                            Building Number:
                          </Text>
                          <Text style={{ color: Color.gray.dark }}>
                            Status:
                          </Text>
                        </View>

                        <View style={{ padding: 5 }}>
                          <Text style={{ color: Color.gray.dark }}>
                            {item.expireDate}
                          </Text>
                          <Text style={{ color: Color.gray.dark }}>
                            {
                              parkings.filter(
                                (pa) => pa.id == item.parkingId
                              )[0].parkingNumber
                            }
                          </Text>
                          <Text style={{ color: Color.gray.dark }}>
                            {
                              parkings.filter(
                                (pa) => pa.id == item.parkingId
                              )[0].buildingNo
                            }
                          </Text>
                          <Text style={{ color: Color.gray.dark }}>
                            {item.status}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Text>Loading...</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.loading}>
                <Button title="Loading button" loading />
              </View>
            )}
          </View>
        </ScrollView>
      ) : loading ? (
        <View style={styles.loading}>
          <Button title="Loading button" loading />
        </View>
      ) : searchedParkings ? (
        <View>
          <ScrollView style={styles.ScrollView}>
            {searchedParkings ? (
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {searchedParkings.map((parking, id) =>
                  parking.occupied ? null : (
                    <TouchableOpacity
                      onPress={() => book(parking)}
                      style={styles.parkingsContainer}
                      key={id}
                    >
                      <View>
                        <Text style={styles.parkingText}>Parking Number</Text>
                        <Text h2 style={styles.parkingText}>
                          {parking.parkingNumber}
                        </Text>
                        <Text style={styles.parkingText}>
                          Building Number: {parking.buildingNo}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                )}
              </View>
            ) : null}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.loading}>
          <Button title="Loading button" loading />
        </View>
      )}

      <Overlay
        overlayStyle={styles.OverlayContainer}
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        {view == "1" && details ? (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            <View style={{ flex: 10, padding: 5 }}>
              <Text style={{ alignSelf: "center" }} h4>
                Parking Information
              </Text>
              <Divider style={{ backgroundColor: "#403D39", margin: 5 }} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  padding: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    padding: 5,
                  }}
                >
                  <Text> Parking Number: </Text>
                  <Text style={{ alignSelf: "center" }} h4>
                    {details.par.parkingNumber}
                  </Text>
                  <Divider style={{ backgroundColor: "#403D39" }} />
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  <Text> Building Number:</Text>
                  <Text style={{ alignSelf: "center" }} h4>
                    {details.par.buildingNo}
                  </Text>
                  <Divider style={{ backgroundColor: "#403D39" }} />
                </View>
              </View>
              <Text> Reservation Date: {details.startTime}</Text>
              <Text> Expires at: {details.expireDate}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  title="Cancel"
                  onPress={() => cancelRes()}
                  buttonStyle={{
                    margin: 2,
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: "#B55B5B",
                  }}
                />
                {details.extended ? (
                  <Button
                    title="Extend"
                    disabled
                    buttonStyle={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      margin: 2,
                      backgroundColor: "#403D39",
                    }}
                  />
                ) : (
                  <Button
                    title="Extend"
                    onPress={() => extendRes()}
                    buttonStyle={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      margin: 2,
                      backgroundColor: "#403D39",
                    }}
                  />
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={{ alignSelf: "center" }} h4>
              New Booking
            </Text>
            <Divider style={{ backgroundColor: "#403D39", margin: 5 }} />
            <View style={{ flex: 10 }}>
              <Text h4 style={styles.parkingText}>
                Parking Number
              </Text>
              <Text h3 style={styles.parkingText}>
                {selectedParkings.parkingNumber}
              </Text>
              <Text h4 style={styles.parkingText}>
                Building Number: {selectedParkings.buildingNo}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                flexDirection: "column",
              }}
            >
              <Text style={{ padding: 5 }}>
                Note: you have until {moment().add(30, "minute").format("LTS")}{" "}
                before the reservation expire
              </Text>
              {loadingButton ? (
                <Button title="Loading button" loading />
              ) : (
                <Button onPress={() => submit()} title="Book" />
              )}
            </View>
          </View>
        )}
      </Overlay>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: height,
    width: width,
    alignItems: "center",
  },
  ScrollView: {
    height: height * 0.8,
  },
  Header: {
    justifyContent: "flex-start",
    alignContent: "center",
    backgroundColor: Color.black.oliver,
    alignSelf: "flex-start",
    width: width,
    height: height * 0.1,
  },
  leftComponent: {
    justifyContent: "center",
    alignSelf: "center",
  },
  rightComponent: {
    justifyContent: "center",
    alignSelf: "center",
  },
  OverlayContainer: {
    width: "80%",
    height: "50%",
    backgroundColor: Color.white,
  },
  parkingsContainer: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    width: "45%",
    borderWidth: 1,
    margin: 5,
    padding: 5,
    backgroundColor: Color.white,
  },
  parkingText: {
    textAlign: "center",
  },
  loading: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
  },
  backgroundImage: {
    //flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    height: height,
    zIndex: -1,
  },
});

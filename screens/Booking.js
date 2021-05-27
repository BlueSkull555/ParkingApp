//@refreshreset
import React, { useState, useEffect, Component } from "react";
import Color from "../Color";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import db from "../db";
import {
  Text,
  Button,
  Overlay,
  Header,
  SearchBar,
  Icon,
  Divider,
} from "react-native-elements";
import firebase from "firebase/app";
import "firebase/auth";
import moment from "moment";
import color from "color";

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
      <Header
        placement="left"
        containerStyle={styles.Header}
        leftContainerStyle={styles.leftComponent}
        rightContainerStyle={styles.rightComponent}
        leftComponent={
          view == "1" ? (
            <Icon
              type="material-community"
              name="arrow-left"
              color="#fff"
              onPress={() => setView("")}
              size={40}
            />
          ) : null
        }
        centerComponent={
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
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#403D39"
        translucent={true}
      />
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
                    color: "red",
                    backgroundColor: "#EE7444",
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
                Note: you have until {moment().add(30, "minute").format("LTS")}
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
    flex: 1,
    backgroundColor: "#FFFCF2",
  },
  ScrollView: {},
  Header: {
    justifyContent: "space-around",
    alignContent: "center",
    backgroundColor: "#403D39",
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
    backgroundColor: "#FFFCF2",
  },
  parkingsContainer: {
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    width: "45%",
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  parkingText: {
    textAlign: "center",
  },
  loading: {
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
  },
});

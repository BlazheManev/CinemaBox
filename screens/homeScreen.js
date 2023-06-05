import { useNavigation } from "@react-navigation/core";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import React from "react";
import { auth } from "../Firebase/firebase";

function HomeScreen(props) {
  const navigation = useNavigation();

  const hanldeSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Prijava");
      })
      .catch((error) => alert(error.message));
  };

  const handleSpored = () => {
    navigation.navigate("Spored");
  };
  const handleFilmi = () => {
    navigation.navigate("Filmi");
  };
  const handleNews = () => {
    navigation.navigate("Novice");
  };

  const handleFavourites = () => {
    navigation.navigate("Všečkani filmi");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://i.ebayimg.com/images/g/4HYAAOSwatFiw-jJ/s-l1600.jpg",
        }}
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />
        <Text style={styles.greeting}>
          Pozdravljeni {auth.currentUser?.email}!
        </Text>
        <View style={styles.buttonContainer}>
          {auth.currentUser?.email ? (
            <TouchableOpacity
              style={styles.topRightButton}
              onPress={handleFavourites}
            >
              <Text style={styles.buttonText}>Všečkani filmi</Text>
            </TouchableOpacity>
          ) : (
            ""
          )}
          {auth.currentUser?.email ? (
            <TouchableOpacity
              style={styles.topRightButton}
              onPress={hanldeSignOut}
            >
              <Text style={styles.buttonText}>Odjava</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.topRightButton}
              onPress={() => navigation.navigate("Prijava")}
            >
              <Text style={styles.buttonText}>Prijava</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={handleSpored}>
            <Text style={styles.buttonText}>Spored</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={handleFilmi}>
            <Text style={styles.buttonText}>Filmi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={handleNews}>
            <Text style={styles.buttonText}>Novice</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  greeting: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "stretch",
    paddingRight: 20,
    marginTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
  },
  topRightButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: "#e31321",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomButton: {
    backgroundColor: "#e31321",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
});

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Napaka = () => (
  <View style={styles.container}>
    <Image
      source={{ uri: "https://i.imgur.com/LHhbfEj.png" }}
      style={styles.image}
    />
    <Text style={styles.red}>Napaka</Text>
    <Text style={styles.grey}>
      Nimate povezave na splet. Prosim preverite vašo povezavo in poskusite
      znova.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#191a1f",
    height: "100%",
    marginTop: 25,
  },
  image: {
    width: "110%",
    marginTop: 10,
    marginBottom: 10,
    height: "50%",
  },
  red: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ad1b29",
  },
  grey: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#9f9c9b",
  },
});

export default Napaka;

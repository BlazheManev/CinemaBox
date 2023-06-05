import React, { useState, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth } from "../Firebase/firebase";
import { useNavigation } from "@react-navigation/core";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Domov");
      }
    });
    return unsubscribe;
  }, []);

  function handleSignUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with: ", user.email);
      })
      .catch((error) => alert(error.message));
  }

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with : ", user.email);
      })
      .catch((error) => alert(error.message));
  }

  return (
    <View style={styles.container} behavior="padding">
      <TouchableOpacity
        onPress={() => navigation.navigate("Domov")}
        style={styles.buttonBack}
      >
        <Text style={styles.buttonTextBack}>Domov</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text
          style={{ color: "#9f9c9b", alignSelf: "center", marginBottom: 5 }}
        ></Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholderTextColor="#191a1f"
        />

        <TextInput
          placeholder="Geslo"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#191a1f"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Prijava</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Registracija</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191a1f",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#9f9c9b",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    color: "#191a1f",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#e31321",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonBack: {
    borderColor: "#e31321",
    borderWidth: 3,
    borderStyle: "solid",
    backgroundColor: "#191a1f",
    width: "20%",
    padding: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonTextBack: {
    color: "#e31321",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#e31321",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#e31321",
    fontWeight: "700",
    fontSize: 16,
  },
});

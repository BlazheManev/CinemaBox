import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/loginScreen";
import SeznamFilmov from "./screens/SeznamFilmov";
import HomeScreen from "./screens/homeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";
import Napaka from "./screens/404";
import Spored from "./screens/Spored";
import EnFilm from "./screens/Spored-film";
import News from "./screens/News";
import LikedMovies from "./screens/LikedMovies";

const Stack = createNativeStackNavigator();
export default function App() {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isConnected === null ? (
        <Text>Preverjanje povezave...</Text>
      ) : isConnected ? (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#333",
              },
              headerTintColor: "#fff",
            }}
          >
            <Stack.Screen
              name="Domov"
              options={{ headerShown: false }}
              component={HomeScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Prijava"
              component={LoginScreen}
            />

            <Stack.Screen name="Filmi" component={SeznamFilmov} />

            <Stack.Screen name="Spored" component={Spored} />
            <Stack.Screen name="Rezervacija" component={EnFilm} />
            <Stack.Screen name="Film" component={EnFilm} />
            <Stack.Screen name="Novice" component={News} />
            <Stack.Screen name="Všečkani filmi" component={LikedMovies} />

          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <Napaka />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    color: "white",
  },
});

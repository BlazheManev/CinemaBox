import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { db } from "../Firebase/firebase";
import { ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const Box = ({ id, image, text, item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.box}
      onPress={() => navigation.navigate("Rezervacija", { item })}
    >
      <Image
        source={{
          uri:
            image ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
        }}
        style={styles.image}
      />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const Boxes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const starcount = ref(db, "arhivFilmov");
    onValue(starcount, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      const filteredData = newData.filter((item) =>
        Array.isArray(item.dvorana)
      );
      setData(filteredData);
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.boxContainer}>
          {data.map((item, i) => (
            <Box
              key={item.id}
              id={item.id}
              image={item.slika}
              text={item.sloNaslov}
              item={[item, i]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191a1f",
  },
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    width: "48%",
    alignItems: "center",
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#9f9c9b",
  },
});
export default Boxes;

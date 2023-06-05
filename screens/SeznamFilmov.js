import React, { useState, useEffect } from "react";
import { auth, db } from "../Firebase/firebase";
import { ref, onValue } from "firebase/database";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ArhivFilmov = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const starcount = ref(db, "arhivFilmov");

    onValue(starcount, (snapshot) => {
      const data = snapshot.val();
      const newData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setData(newData);
    });
  }, []);

  const filteredData = selectedCategory
    ? data.filter(
        (item) =>
          item.vrsta &&
          item.vrsta.includes(selectedCategory) &&
          item.originalniNaslov
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : data.filter((item) =>
        item.originalniNaslov.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filtriraj po kategoriji:</Text>
        <ScrollView horizontal={true}>
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "AKCIJSKA" && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedCategory("AKCIJSKA")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === "AKCIJSKA" &&
                    styles.activeFilterButtonText,
                ]}
              >
                Akcijska
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "KOMEDIJA" && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedCategory("KOMEDIJA")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === "KOMEDIJA" &&
                    styles.activeFilterButtonText,
                ]}
              >
                Komedija
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "DRAMA" && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedCategory("DRAMA")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === "DRAMA" && styles.activeFilterButtonText,
                ]}
              >
                Drama
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "GROZLJIVKA" && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedCategory("GROZLJIVKA")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === "GROZLJIVKA" &&
                    styles.activeFilterButtonText,
                ]}
              >
                Grozljivka
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === "TRILER" && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedCategory("TRILER")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === "TRILER" &&
                    styles.activeFilterButtonText,
                ]}
              >
                Triler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedCategory === null && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === null && styles.activeFilterButtonText,
                ]}
              >
                Vse
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Išči po naslovu"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView style={styles.moviesContainer}>
        {filteredData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.movieContainer}
            onPress={() => navigation.navigate("Film", { item })}
          >
            <Image
              source={{
                uri:
                  item.slika ||
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
              }}
              style={styles.moviePoster}
            />
            <View style={styles.movieInfoContainer}>
              <Text style={styles.movieTitle}>{item.sloNaslov}</Text>
              <Text style={styles.movieCategory}>{item.vrsta}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191a1f",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
  },
  filterText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#9f9c9b",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  filterButton: {
    backgroundColor: "#9f9c9b",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: "#e31321",
  },
  filterButtonText: {
    color: "#191a1f",
  },
  activeFilterButtonText: {
    color: "white",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
  },
  searchInput: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 20,
  },
  moviesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  movieContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#212229",
    borderBottomColor: "#e31321",
    borderWidth: 1,
  },
  moviePoster: {
    width: 80,
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
  },
  movieInfoContainer: {
    marginLeft: 10,
  },
  movieTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#9f9c9b",
  },
  movieCategory: {
    fontSize: 14,
    color: "#9f9c9b",
    marginTop: 5,
  },
  movieYear: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});

export default ArhivFilmov;

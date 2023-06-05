import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(
      "https://newsapi.org/v2/everything?q=movies&sortBy=popularity&apiKey=95bcb1147afa45af96f84a3525487729"
    )
      .then((response) => response.json())
      .then((responseJson) => setNews(responseJson.articles))
      .catch((error) => console.log(error));
  }, []);

  const handleURL = (url) => {
    Alert.alert("Preusmeritev", `Ali želite odpreti povezavo v brskalniku`, [
      {
        text: "Ne",
        style: "cancel",
      },
      {
        text: "Da",
        onPress: () => {
          Linking.openURL(url);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {news.map((article) => (
          <TouchableOpacity
            key={article.url}
            onPress={() => handleURL(article.url)}
          >
            <View style={styles.articleContainer}>
              <Image
                style={styles.image}
                source={{ uri: article.urlToImage }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.description}>{article.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  big: {
    fontSize: 30,
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "#191a1f",
  },
  articleContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
    borderBottomColor: "#e31321",
    borderWidth: 1,
    backgroundColor: "#212229",
    borderColor: "#212229",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#9f9c9b",
  },
  description: {
    marginTop: 5,
    fontSize: 12,
    color: "#9f9c9b",
  },
});
//"#191a1f",#9f9c9b" },#e31321
export default News;

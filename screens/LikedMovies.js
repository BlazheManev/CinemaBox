import React, { useEffect, useState } from 'react';
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
import firebase from 'firebase/app';
import { auth, db } from "../Firebase/firebase";
import { ref, onValue, get } from "firebase/database";
import { useNavigation } from "@react-navigation/native";


function LikedMovies(props) {
    const navigation = useNavigation();

    const [likedMovies, setLikedMovies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const likesReference = ref(db, 'likes');
            const moviesReference = ref(db, 'arhivFilmov');

            let newLikedMovies = [];

            let likedMoviesIds = new Array;

            const likesSnapshot = await get(likesReference);
            const likesData = likesSnapshot.val();

            Object.values(likesData).forEach((element) => {
                if (element.email === auth.currentUser?.email) {
                    likedMoviesIds = element.movieID;
                }
            });

            onValue(moviesReference, (snapshot) => {
                newLikedMovies = [];
                const moviesData = snapshot.val();
                Object.entries(moviesData).forEach(([key, value]) => {
                    if (likedMoviesIds.includes(key)) {
    
                        newLikedMovies.push({...value, id:key});
                    }
                });
                setLikedMovies(newLikedMovies);
              });

        };

        fetchData();
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.moviesContainer}>
                {likedMovies.map((item) => (
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


export default LikedMovies;

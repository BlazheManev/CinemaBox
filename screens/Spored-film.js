import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import { db, auth } from "../Firebase/firebase";
import { ref, push, get, update } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

function EnFilm(film) {
  const navigation = useNavigation();
  const [item, setItem] = useState({});
  let st;

  let sum = 0;
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState("");
  const [stevilka, setStevilka] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState("");
  const [uporabniskaOcena, setUporabniskaOcena] = useState(0);
  const [ocenaFilma, setOcenaFilma] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);

  const likesRef = ref(db, "likes");
  get(likesRef).then((snapshot) => {
    const likes = snapshot.val();
    for (const key in likes) {
      if (Object.prototype.hasOwnProperty.call(likes, key)) {
        const email = likes[key].email;
        if (email === auth.currentUser.email) {
          let array = likes[key].movieID;
          for (let i = 0; i < array.length; i++) {
            if (item.id == array[i]) {
              setIsFavorite(true);
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    if (film.route.params.item.length) {

      let myFilmData = film.route.params.item[0];
      setItem(myFilmData);
      st = film.route.params.item[1];

      const myItem = film.route.params.item[0];
      if (!myItem.ocene) return;

      const sum = myItem.ocene.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.ocena;
      }, 0);

      const average = sum / myItem.ocene.length;
      setOcenaFilma(average);

      const existingObjectIndex = myItem.ocene.findIndex(obj => obj.uporabnik === auth.currentUser?.email);

      if (existingObjectIndex !== -1) {
        setUporabniskaOcena(myItem.ocene[existingObjectIndex].ocena)
      }
    } else {
      setItem(film.route.params.item);
      const myItem = film.route.params.item;
      if (!myItem.ocene) return;

      const sum = myItem.ocene.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.ocena;
      }, 0);

      const average = sum / myItem.ocene.length;
      setOcenaFilma(average);

      const existingObjectIndex = myItem.ocene.findIndex(obj => obj.uporabnik === auth.currentUser?.email);

      if (existingObjectIndex !== -1) {
        setUporabniskaOcena(myItem.ocene[existingObjectIndex].ocena)
      }
    }
  }, []);

  useEffect(() => {
    if (!item.ocene) return;

    const sum = item.ocene.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.ocena;
    }, 0);

    const average = sum / item.ocene.length;
    setOcenaFilma(average);
  }, [uporabniskaOcena]);


  const funkcijaZaKomentiranje = async () => {
    let filmData = JSON.parse(JSON.stringify(item));
    const key = filmData.id;

    if (!filmData.komentarji) {
      filmData.komentarji = [];
      filmData.komentarji.push({ komentar: text, uporabnik: auth.currentUser?.email });
    } else {
      filmData.komentarji.push({ komentar: text, uporabnik: auth.currentUser?.email });

    }
    delete filmData.id;


    update(ref(db, `arhivFilmov/${key}`), {
      komentarji: filmData.komentarji,
    }).then(() => {
      filmData.id = key;
      setItem(filmData);
    })
      .catch((error) => {
        console.log(error);
      });
  };
  const funkcijaZaOcene = (ocena) => {
    let filmData = JSON.parse(JSON.stringify(item));
    const key = filmData.id;
    delete filmData.id;


    if (!filmData.ocene) {
      filmData.ocene = [];
    }


    const newObject = { ocena: ocena, uporabnik: auth.currentUser?.email };

    const existingObjectIndex = filmData.ocene.findIndex(obj => obj.uporabnik === newObject.uporabnik);

    if (existingObjectIndex !== -1) {
      filmData.ocene[existingObjectIndex].ocena = newObject.ocena;
    } else {
      filmData.ocene.push(newObject);
    }

    update(ref(db, `arhivFilmov/${key}`), {
      ocene: filmData.ocene,
    }).then(() => {
      filmData.id = key;
      setItem(filmData);
      setUporabniskaOcena(ocena);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  let commentsToShow;
  let dolzina;

  if (item.komentarji === undefined) {
    commentsToShow = [];
    dolzina = 0;
  } else {
    commentsToShow = showMore ? item.komentarji : item.komentarji.slice(0, 5);
    dolzina = item.komentarji.length;
  }
  if (item.dvorana === undefined) {
    item.dvorana = [];
  }

  function handlePress(d, i) {
    setShowInput(true);
    setData(d);
    setStevilka(i);
  }

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleSubmit = () => {
    if (inputValue > 0) {
      Alert.alert(
        "Potrdi rezervacijo",
        `Ali želite rezervirati sedeze za ${inputValue} ?`,
        [
          {
            text: "Ne",
            style: "cancel",
          },
          {
            text: "Potrdi",
            onPress: () => {
              if (data.prostaMesta - inputValue >= 0) {
                update(ref(db, `/sporedFilmov/${st}/dvorana/${stevilka}/`), {
                  prostaMesta: data.prostaMesta - inputValue,
                })
                  .then(() => {
                    console.log("Data updated successfully");
                  })
                  .catch((error) => {
                    console.log("Error updating data:", error);
                  });
                setData(false);
                setShowInput(false);
                setInputValue("");
                data.prostaMesta = data.prostaMesta - inputValue;
              } else {
                Alert.alert(
                  "Napaka",
                  `
              Žal je prostih le še  ${data.prostaMesta} mest`,
                  [
                    {
                      text: "OK",
                      style: "default",
                    },
                  ],
                  { cancelable: false }
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Napačen vnos",
        `Prosimo vpišite število vstopnic, ki jih želite rezervirati.`,
        [
          {
            text: "ok",
            style: "cancel",
          },
        ]
      );
    }
  };


  function dodajFavorites(id) {
    const likesRef = ref(db, "likes");
    let ifs = false;
    get(likesRef)
      .then((snapshot) => {
        const likes = snapshot.val();
        for (const key in likes) {
          if (Object.hasOwnProperty.call(likes, key)) {
            const email = likes[key].email;
            if (email === auth.currentUser?.email) {
              if (likes[key].movieID !== undefined) {
                const array = likes[key].movieID;
                array.push(id);
                update(ref(db, `likes/${key}`), {
                  movieID: array,
                });
                setIsFavorite(true);
                ifs = true;
                break;
              } else {
                update(ref(db, `likes/${key}`), {
                  movieID: [id],
                });
                setIsFavorite(true);
                ifs = true;
                break;
              }
            }
          }
        }
        if (ifs === false) {
          push(ref(db, "likes"), {
            email: auth.currentUser?.email,
            movieID: [id],
          })
            .then(() => {
              console.log("data entered");
              setIsFavorite(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log("Error getting likes from Firebase:", error);
      });
  }

  function izbrisiFavorites(id) {
    const likesRef = ref(db, "likes");
    get(likesRef)
      .then((snapshot) => {
        const likes = snapshot.val();
        for (const key in likes) {
          if (Object.hasOwnProperty.call(likes, key)) {
            const email = likes[key].email;
            if (email === auth.currentUser?.email) {
              const array = likes[key].movieID;
              const index = array.indexOf(id);
              if (index > -1) {
                // only splice array when item is found
                array.splice(index, 1); // 2nd parameter means remove one item only
              }
              update(ref(db, `likes/${key}`), {
                movieID: array,
              });
              setIsFavorite(false);
              break;
            }
          }
        }
      })
      .catch((error) => {
        console.log("Error getting likes from Firebase:", error);
      });
  }

  return (
    <ScrollView>
      <View style={{ backgroundColor: "#191a1f" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            margin: 10,
            color: "#9f9c9b",
          }}
        >
          {item.sloNaslov} <Text style={styles.red}>/</Text>{" "}
          <Text style={{ fontStyle: "italic" }}>{item.originalniNaslov}</Text>
          <Text style={styles.red}> / </Text>
          {ocenaFilma == 0 ? "Neocenjeno" : ocenaFilma.toFixed(2)}
          /5
        </Text>

        <Image
          source={{
            uri:
              item.slika ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
          }}
          style={{ width: "100%", height: 400 }}
        />
        {auth.currentUser?.email ? (
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#9f9c9b" }}>Izberite oceno: </Text>
            <TouchableOpacity onPress={() => funkcijaZaOcene(1)}>
              <Text style={uporabniskaOcena == 1 ? styles.checkedGrade : styles.grade}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => funkcijaZaOcene(2)}>
              <Text style={uporabniskaOcena == 2 ? styles.checkedGrade : styles.grade}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => funkcijaZaOcene(3)}>
              <Text style={uporabniskaOcena == 3 ? styles.checkedGrade : styles.grade}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => funkcijaZaOcene(4)}>
              <Text style={uporabniskaOcena == 4 ? styles.checkedGrade : styles.grade}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => funkcijaZaOcene(5)}>
              <Text style={uporabniskaOcena == 5 ? styles.checkedGrade : styles.grade}>5</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#9f9c9b" }}>
              Za ocenjevanje se prijavite{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Prijava")}>
              <Text style={styles.grade}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Prijava")}>
              <Text style={styles.grade}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Prijava")}>
              <Text style={styles.grade}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Prijava")}>
              <Text style={styles.grade}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Prijava")}>
              <Text style={styles.grade}>5</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={{ margin: 10, color: "#9f9c9b" }}>
          {item.cas} <Text style={styles.red}>|</Text> {item.drzava}{" "}
          <Text style={styles.red}>|</Text> {item.jezik}{" "}
          <Text style={styles.red}>|</Text> {item.vrsta}
        </Text>

        <Text style={{ margin: 10, color: "#9f9c9b" }}>
          Igralci: {item.igralci || "Neznano"}
        </Text>
        <Text style={{ margin: 10, color: "#9f9c9b" }}>
          Režija: {item.rezija || "Neznano"}
        </Text>
        <Text style={{ margin: 10, color: "#9f9c9b" }}>
          Scenarij: {item.scenarij || "Neznano"}
        </Text>

        <Text style={{ margin: 10, color: "#9f9c9b" }}>{item.opis}</Text>

        <View style={{ marginLeft: 15, marginBottom: 20 }}>
          <Text style={(styles.title, { color: "#e31321" })}>
            Komentarji ({dolzina})
          </Text>
          {commentsToShow.map((comment, index) => (
            <View key={index}>
              <Text style={{ color: "#9f9c9b" }}>
                {comment.uporabnik}: {comment.komentar}
              </Text>
            </View>
          ))}

          {dolzina > 5 && !showMore && (
            <Button title="Show more" onPress={() => setShowMore(true)} />
          )}
          {dolzina > 5 && showMore && (
            <Button title="Show less" onPress={() => setShowMore(false)} />
          )}
        </View>
        {auth.currentUser?.email ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 15,
              marginBottom: 30,
            }}
          >
            <TextInput
              style={{
                height: 40,
                borderColor: "#9f9c9b",
                borderWidth: 0.5,
                width: "65%",
                color: "#9f9c9b",
              }}
              onChangeText={setText}
              value={text}
            />
            <TouchableOpacity onPress={funkcijaZaKomentiranje}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#e31321",
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#e31321",
                    margin: 5,
                  }}
                >
                  Pošlji komentar
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 15,
              marginBottom: 30,
            }}
          >
            <TextInput
              style={{
                height: 40,
                borderColor: "#9f9c9b",
                borderWidth: 0.5,
                width: "65%",
                color: "#9f9c9b",
              }}
              editable={false}
              value=" Za komentiranje se prijavite"
            />
            <TouchableOpacity onPress={() => navigation.navigate("Prijava")}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#e31321",
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#e31321",
                    margin: 5,
                  }}
                >
                  Prijava
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {showInput && (
          <>
            <Text style={{ marginLeft: 20, fontSize: 15, color: "#9f9c9b" }}>
              Rezerviral/a bi:
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 20,
              }}
            >
              <TextInput
                value={inputValue}
                onChangeText={handleInputChange}
                placeholder="Vnesite število rezervacij"
                placeholderTextColor="white"
                underlineColorAndroid="#e31321"
                keyboardType="numeric"
                maxLength={2}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  padding: 10,
                  backgroundColor: "#9f9c9b",
                }}
              />
              <TouchableOpacity onPress={handleSubmit}>
                <Text
                  style={{
                    marginLeft: 10,
                    padding: 10,
                    backgroundColor: "#e31321",
                    color: "white",
                  }}
                >
                  Rezerviraj
                </Text>
              </TouchableOpacity>
            </View>
            {data && (
              <View style={{ marginLeft: 20, fontSize: 15 }}>
                <Text style={{ color: "#9f9c9b" }}>
                  mest za film, ki se predvaja
                  <Text style={styles.text}> {data.datum} </Text>
                  ob
                  <Text style={styles.text}> {data.ura} </Text>v dvorani{" "}
                  <Text style={styles.text}> {data.ime} </Text>z še{" "}
                  <Text style={styles.text}> {data.prostaMesta}</Text> prostimi
                  sedeži.
                </Text>
              </View>
            )}
          </>
        )}
        <View style={styles.numbersContainer}>
          <ScrollView horizontal={true}>
            {item.dvorana.map((number, i) => (
              <TouchableOpacity onPress={() => handlePress(number, i)} key={i}>
                <View style={styles.number}>
                  <Text style={styles.numberText}>{number.datum}</Text>
                  <Text style={styles.numberText}>{number.ura}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isFavorite && auth.currentUser?.email ? (
          <Button
            title="Odstrani iz všečkanih"
            style={styles.button}
            color="red"
            onPress={() => izbrisiFavorites(item.id)}
          />
        ) : (
          ""
        )}
        {!isFavorite && auth.currentUser?.email ? (
          <Button
            title="Dodaj k všečkanim"
            onPress={() => dodajFavorites(item.id)}
          />
        ) : (
          ""
        )}
        {!isFavorite && !auth.currentUser?.email ? (
          <Button
            title="Dodaj k všečkanim"
            onPress={() => navigation.navigate("Prijava")}
          />
        ) : (
          ""
        )}
      </View>
      <View></View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  red: { color: "#e31321" },
  numbersContainer: { padding: 10 },
  number: {
    width: 80,
    height: 60,
    backgroundColor: "#e31321",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  numberText: { fontSize: 15, color: "#fff" },
  text: { fontStyle: "bold", fontSize: 20 },
  title: { fontWeight: "bold", color: "#9f9c9b", fontSize: 17 },
  info: { color: "#9f9c9b" },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  summary: {
    fontSize: 16,
    marginTop: 10,
  },
  grade: {
    color: "white",
    width: 25,
    height: 25,
    padding: 3,
    backgroundColor: "#e31321",
    marginHorizontal: 5,
    textAlign: "center",
  },
  checkedGrade: {
    color: "black",
    width: 25,
    height: 25,
    padding: 3,
    backgroundColor: "#AAAAAA",
    marginHorizontal: 5,
    textAlign: "center",
  },
});

export default EnFilm;

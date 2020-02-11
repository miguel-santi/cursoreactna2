import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Card, Image, Rating } from "react-native-elements";
import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async => {
      db.collection("restaurants")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then(response => {
          //console.log(response);
          const restaurantsArray = [];
          response.forEach(doc => {
            //console.log(doc.data());
            restaurantsArray.push(doc.data());
          });
          setRestaurants(restaurantsArray);
        })
        .catch(() => {
          console.log("Error al cargar el Ranking,intentelo mas tarde ");
        });
    })();
  }, []);

  return (
    <View>
      <Text> Estamos en el ranking de Restaurantes.</Text>
    </View>
  );
}

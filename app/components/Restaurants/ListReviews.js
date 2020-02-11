import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
//inicializamos nuestra base de datos
const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { navigation, idRestaurant, setRating } = props;
  // console.log(props);
  const [reviews, setReviews] = useState([]);
  const [reviewsReload, setReviewsReload] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  //Para validar que los usuarios no logueadmos no puedan comentar
  firebase.auth().onAuthStateChanged(user => {
    //sacamos el estado del usuario
    user ? setUserLogged(true) : setUserLogged(false);
  });

  //console.log(reviews);

  //Este useEffect se ejecutara cada vez que modifiquemos el estado de reviewsReload
  useEffect(() => {
    (async () => {
      const resultReviews = [];
      const arrayRating = [];
      //OJO:EN ESTE EJEMPLO UTILIZAMOS EL WHERE PARA HACER UNA CONSULTA A FIREBASE
      db.collection("reviews")
        .where("idRestaurant", "==", idRestaurant)
        .get()
        .then(response => {
          response.forEach(doc => {
            //const review = doc.data();
            //resultReviews.push(review);
            //arrayRating.push(review.rating);
            //-------o lo podemos hacer asi
            resultReviews.push(doc.data()); //Aqui guardamos la consulta de toda la data del where
            arrayRating.push(doc.data().rating);
          });
          let numSum = 0;
          arrayRating.map(value => {
            numSum = numSum + value;
          });
          //Esto se hace para poder dividir la cantidad de suma
          //de rating entre la cantidad de reviews recibidos
          const countRating = arrayRating.length;
          const resultRating = numSum / countRating;
          //Si resultrating no fuese un valor, o null, o undefined
          //entonces devolvemos un valor
          const resultRatingFinish = resultRating ? resultRating : 0;

          setReviews(resultReviews);
          setRating(resultRatingFinish);
        });
      setReviewsReload(false);
    })();
  }, [reviewsReload]);

  return (
    <View>
      {userLogged ? (
        <Button
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          title="Escribir una opinion"
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680"
          }}
          onPress={() =>
            navigation.navigate("AddReviewRestaurant", {
              idRestaurant: idRestaurant,
              setReviewsReload: setReviewsReload
            })
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => navigation.navigate("Login")}
          >
            Para escribir un comentario es necesario estar logueado{" "}
            <Text style={{ fontWeight: "bold" }}>
              pulsa AQUI para iniciar sesion
            </Text>
          </Text>
        </View>
      )}

      <FlatList
        data={reviews}
        renderItem={review => <Review review={review} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

function Review(props) {
  const { title, review, rating, createAt, avatarUser } = props.review.item;
  const createReview = new Date(createAt.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size={"large"}
          rounded
          containerStyle={styles.imageAvatarUser}
          source={{
            uri: avatarUser
              ? avatarUser
              : "https://api.adorable.io/avatars/285/abott@adorable.png"
          }}
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {createReview.getDate()}/{createReview.getMonth() + 1}/
          {createReview.getFullYear()}-{createReview.getHours()}:
          {createReview.getMinutes() < 10 ? "0" : ""}
          {createReview.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent"
  },
  btnTitleAddReview: {
    color: "#00a680"
  },
  viewReview: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  viewImageAvatar: {
    marginRight: 15
  },
  imageAvatarUser: {
    width: 50,
    height: 50
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start"
  },
  reviewTitle: {
    fontWeight: "bold"
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 4
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0
  }
});

import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
//Inicializamos nuesta base de datos
const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
  const { navigation } = props;
  //console.log(navigation);
  const { idRestaurant, setReviewsReload } = navigation.state.params;

  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef();
  console.log(idRestaurant);

  const addReview = () => {
    //console.log(rating);
    if (rating === null) {
      toastRef.current.show("No has dado ninguna puntuacion");
    } else if (!title) {
      toastRef.current.show("El titulo es obligatorio");
    } else if (!review) {
      toastRef.current.show("El comentario es obligatorio");
    } else {
      setIsLoading(true);
      //console.log("Comentario enviado");
      const user = firebase.auth().currentUser;
      //Creamos el payload , es la informacion que mandaremos a firebase para que guarde
      //console.log(user);
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant: idRestaurant,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date()
      };
      //console.log(payload);
      db.collection("reviews")
        .add(payload)
        .then(() => {
          console.log("Comentario guardado");
          updateRestaurant();
        })
        .catch(() => {
          setIsLoading(false);
          toastRef.current.show(
            "Error al enviar la review, intentelo mas tarde"
          );
          //setIsLoading(false);
        });
    }
  };

  const updateRestaurant = () => {
    //Accedemos a la tabla restaurants y tomamos el docuemento y tomamos dicho restaurante
    //con ese id
    const restaurantRef = db.collection("restaurants").doc(idRestaurant);
    restaurantRef.get().then(response => {
      const restaurantData = response.data();
      //console.log(restaurantData);
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;
      //Aqui abajo podemos usar destructoring para enviar las variables,
      //como son iguales que en la base de datos
      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal: ratingTotal,
          quantityVoting: quantityVoting
        })
        .then(() => {
          setIsLoading(false);
          setReviewsReload(true);
          navigation.goBack();
        });
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.viewBody}>
        <View styles={styles.viewRating}>
          <AirbnbRating
            count={5}
            reviews={[
              "Pesimo",
              "Deficiente",
              "Normal",
              "Muy Bueno",
              "Excelente"
            ]}
            defaultRating={0}
            size={35}
            onFinishRating={value => setRating(value)}
          />
        </View>
        <View style={styles.formReview}>
          <Input
            placeholder="Titulo"
            containerStyle={styles.input}
            onChange={e => setTitle(e.nativeEvent.text)}
          ></Input>
          <Input
            placeholder="Comentario..."
            multiline={true}
            inputContainerStyle={styles.textArea}
            onChange={e => setReview(e.nativeEvent.text)}
          />
          <Button
            title="Enviar Comentario"
            onPress={addReview}
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
          />
        </View>
        <Toast ref={toastRef} position="center" opacity={0.5} />
        <Loading isVisible={isLoading} text="Enviando comentario" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});

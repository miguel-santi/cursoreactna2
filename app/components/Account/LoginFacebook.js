import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );
    if (type === "success") {
      setIsLoading(true);
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          //console.log("Login correcto...");
          navigation.navigate("MyAccount");
        })
        .catch(() => {
          //console.log("Error accediento con Facebook, intentelo mas tarde");
          toastRef.current.show(
            "Error accediento con Facebook, intentelo mas tarde"
          );
        });
    } else if (type === "cancel") {
      toastRef.current.show("Inicio de sesion cancelado");
    } else {
      toastRef.current.show("Error desconocido, intentelo mas tarde");
    }
    setIsLoading(false);
  };

  const login2 = async () => {
    try {
      await Facebook.initializeAsync(FacebookApi.application_id);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: FacebookApi.permissions
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        console.log("Logged in!", `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }

    //console.log(type);
  };
  const login3 = async () => {
    try {
      await Facebook.initializeAsync("757713831407462");
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync(
        FacebookApi.application_id,
        { permissions: ["public_profile"] }
      );

      if (type === "success") {
        //setIsLoading(true);
        const credentials = firebase.auth.FacebookAuthProvider.credential(
          token
        );
        await firebase
          .auth()
          .signInWithCredential(credentials)
          .then(() => {
            navigation.navigate("MyAccount");
          })
          .catch(() => {
            toastRef.current.show(
              "Error accediendo con Facebook, inténtelo más tarde"
            );
          });
      } else if (type === "cancel") {
        toastRef.current.show("Inicio de sesión cancelado");
      } else {
        toastRef.current.show("Error desconocido, inténtelo más tarde");
      }
      //setIsLoading(false);
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  };

  return (
    <>
      <SocialIcon
        title="Iniciar Sesión con Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={isLoading} text="Iniciando sesión" />
    </>
  );
}

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";

import * as firebase from "firebase";
import { withNavigation } from "react-navigation";
import Loading from "../Loading";

function RegisterForm(props) {
  const { toastRef, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const register = async () => {
    // console.log("Usuario registrado");
    // console.log("Email:" + email);
    // console.log("Password: " + password);
    // console.log("Repeat Password: " + repeatPassword);
    // const resultEmailValidation = validateEmail(email);
    // console.log("Validacion del email: " + resultEmailValidation);
    setIsVisibleLoading(true);
    if (!email || !password || !repeatPassword) {
      //console.log("Todos los campos son obligatorios");
      toastRef.current.show("Todos los campos son obligatorios");
    } else {
      if (!validateEmail(email)) {
        //console.log("El email no es correcto");
        toastRef.current.show("El email no es correcto");
      } else {
        if (password !== repeatPassword) {
          //console.log("Las contraseñas no son iguales");
          toastRef.current.show("Las contraseñas no son iguales");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              //console.log("Usuario creado correctamente");
              //toastRef.current.show("Usuario creado correctamentes");
              navigation.navigate("MyAccount");
            })
            .catch(() => {
              //console.log("Error al crear la cuenta, intentelo mas tarde");
              toastRef.current.show(
                "Error al crear la cuenta, intentelo mas tarde"
              );
            });
        }
      }
    }
    setIsVisibleLoading(false);
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electronico"
        containerStyle={styles.inputForm}
        //onChange={() => console.log("Email actualizado")}
        onChange={e => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      ></Input>
      <Input
        placeholder="Contraseña"
        password={true}
        secureTextEntry={hidePassword}
        containerStyle={styles.inputForm}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      ></Input>
      <Input
        placeholder=" Repetir contraseña"
        password={true}
        secureTextEntry={hideRepeatPassword}
        containerStyle={styles.inputForm}
        onChange={e => setRepeatPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hideRepeatPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHideRepeatPassword(!hideRepeatPassword)}
          />
        }
      ></Input>
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={register}
      />
      <Loading text="Creando cuenta" isVisible={isVisibleLoading} />
    </View>
  );
}
export default withNavigation(RegisterForm);
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%"
  },
  btnRegister: {
    backgroundColor: "#00a680"
  }
});

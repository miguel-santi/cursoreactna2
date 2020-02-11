import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantForm from "../../components/Restaurants/AddRestaurantForm";
//Este js le mandara por props la opcion de navigation al componente AddRestaurantForm.js
export default function AddRestaurant(props) {
  const { navigation } = props;
  const { setIsReloadRestaurants } = navigation.state.params;
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View>
      <AddRestaurantForm
        toastRef={toastRef}
        setIsLoading={setIsLoading}
        navigation={navigation}
        setIsReloadRestaurants={setIsReloadRestaurants}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Creando Restaurante" />
    </View>
  );
}

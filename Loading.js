import React from "react";
import { View, Text } from "react-native";
export default function Loading(props) {
  const { text, textTwo } = props;
  console.log(props);
  return (
    <View>
      <Text>
        Cargando {text} {textTwo}
      </Text>
    </View>
  );
}

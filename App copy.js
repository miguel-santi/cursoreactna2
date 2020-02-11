import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Loading from "./Loading";
export default function App() {
  const name = "Agustin";
  const lastName = "Navarro Galdon";
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Loading text="restaurante"></Loading>
      <Loading text="usuarios"></Loading>
      <Loading text={name} textTwo={lastName}></Loading>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

/////Clase 13:useState - Hook

import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Loading from "./Loading";
export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading === true) {
    console.log("Loading : TRUE");
  } else {
    console.log("Loading : FALSE");
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      {isLoading === true && <Loading />}
      <Button
        title="Actualizar Estado"
        onPress={() => setIsLoading(true)}
      ></Button>
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

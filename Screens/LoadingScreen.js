import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { Storage } from "expo-storage";

const LAYOUT = Dimensions.get("window");

const LoadingScreen = (props) => {
  const getItem = async () => {
    const item = JSON.parse(await Storage.getItem({ key: "isIntroFinished" }));

    setTimeout(() => {
      props.navigation.reset({
        index: 0,
        routes: [{ name: item ? "HomeScreen" : "IntroScreen" }],
      });
    }, 4000);
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        resizeMode="contain"
        source={require("../assets/Animations/loading.json")}
        style={styles.animation}
        loop
        autoPlay
      />
      <Text style={styles.smp}>Loading SMP .....</Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    width: LAYOUT.width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: "60%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  smp: {
    fontWeight: "bold",
  },
});

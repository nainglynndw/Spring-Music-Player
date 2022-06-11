import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { Storage } from "expo-storage";

const LAYOUT = Dimensions.get("window");

const bgs = ["#A5BBFF", "#DDBEFE", "#FF63ED", "#B98EFF"];

const data = [
  {
    animation: require("../assets/Animations/speaker.json"),
    slogan: "BEING HIGH",
  },
  {
    animation: require("../assets/Animations/trumpet.json"),
    slogan: "FEED YOUR SOUL",
  },
  {
    animation: require("../assets/Animations/violin.json"),
    slogan: "LOVE  |  PEACE  |  MUSIC",
  },
  {
    animation: require("../assets/Animations/guitar.json"),
    slogan: "LET'S ROCK ! ",
    final: true,
  },
];
const Indicator = ({ scrollX }) => {
  return (
    <View style={styles.indicatorContainer}>
      {data &&
        data.map((_, index) => {
          const inputRange = [
            (index - 1) * LAYOUT.width,
            index * LAYOUT.width,
            (index + 1) * LAYOUT.width,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 0.9, 0.6],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[
                styles.indicator,
                {
                  opacity,
                  transform: [
                    {
                      scale,
                    },
                  ],
                },
              ]}
              key={index.toString()}
            ></Animated.View>
          );
        })}
    </View>
  );
};

const Backdrop = ({ scrollX }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * LAYOUT.width),
    outputRange: bgs.map((bg) => bg),
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
    ></Animated.View>
  );
};

const IntroScreen = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const introFinished = async () => {
    await Storage.setItem({
      key: "isIntroFinished",
      value: JSON.stringify(true),
    });
    alert("Intro Finished");
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <LottieView
          resizeMode="contain"
          source={item.animation}
          style={styles.lottieItem}
          autoPlay
          loop
        />
        {item.final ? (
          <TouchableOpacity style={styles.final} onPress={introFinished}>
            <Text style={styles.slogan}>{item.slogan}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.slogan}>{item.slogan}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Backdrop scrollX={scrollX} />
      <Animated.FlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
      <Indicator scrollX={scrollX} />
      <StatusBar hidden />
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    width: LAYOUT.width,
    height: LAYOUT.height,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  itemContainer: {
    width: LAYOUT.width,
    alignItems: "center",
  },
  lottieItem: {
    width: LAYOUT.width * 0.7,
    height: LAYOUT.height * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
  },
  indicator: {
    width: 7,
    height: 7,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  slogan: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  final: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#fff",
  },
});

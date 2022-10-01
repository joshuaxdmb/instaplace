import React from "react";
import { View, Text, Image, Button, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const ProfilePost = (props) => {
  const { post, id } = props;
  const { caption, imageUrl } = post;

  return (
    <View style={styles.mainContainer}>
        <Image source={{ url: imageUrl }} style={styles.image} />
    </View>
  );
};

const styles = {
  mainContainer: {
    backgroundColor: "white",
    flex: 1/3,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  captionContainer: {
    justifyContent: "start",
    alignItems: "start",
    width: "100%",
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    aspectRatio: 1 / 1,
  },
};

export { ProfilePost };

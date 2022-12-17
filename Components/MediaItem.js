import React from "react";
import { View, Text, Image, Button, Dimensions, TouchableOpacity } from "react-native";

const windowWidth = Dimensions.get("window").width;

const MediaItem = (props) => {
  const { post, id, onPress} = props;
  const { caption, imageUrl } = post;

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={()=>onPress(imageUrl)}>
        <Image source={{ url: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = {
  mainContainer: {
    backgroundColor: "white",
    flex: 1/3,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 0.5,
  },
  captionContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    aspectRatio: 1 / 1,
  },
};

export { MediaItem };

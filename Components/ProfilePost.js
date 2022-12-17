import React from "react";
import { TouchableOpacity, Text, Image, Button, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const ProfilePost = (props) => {
  const { post, id, uid, navigation, onClick } = props;
  const { caption, imageUrl, user, comments, userImage = null } = post;

  const onTouch = () => {
    onClick(id)
  };

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onTouch}>
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

export { ProfilePost };

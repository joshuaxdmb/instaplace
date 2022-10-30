import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../App";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { defaultColors } from "../Constants/Colors";

const windowWidth = Dimensions.get("window").width;

const FeedPost = (props) => {
  const [postUsername, setPostUsername] = useState("");

  const { post, id, uid, navigation } = props;
  const { caption, imageUrl, user, comments, userImage = null } = post;

  const onTouch = () => {
    navigation.navigate("PostScreen", {
      postId: id,
      uid,
      imageUrl,
      caption,
      comments,
      userImage
    });
  };

  const getUsername = async () => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    setPostUsername(snap.data().name);
  };

  useEffect(() => {
    getUsername();
    props.navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginHorizontal: 10 }}>
          <Ionicons
            color={"black"}
            size={30}
            onPress={() => {
              props.navigation.goBack();
            }}
            name="chevron-back-outline"
          />
        </View>
      ),
    });
  }, [uid, post]);

  return (
    <TouchableOpacity onPress={onTouch}>
      <View style={styles.mainContainer}>
        <Image source={{ url: imageUrl }} style={styles.image} />
        <View style={styles.captionImage}>
          <Image source={{ url: userImage }} style={styles.userImage} />
          <View style={styles.captionContainer}>
            <Text style={styles.defaultText}>
              {postUsername}: {caption}
            </Text>
            <TouchableOpacity onPress={onTouch}>
              <Text style={styles.defaultText}>View all comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  mainContainer: {
    backgroundColor: defaultColors.background,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: windowWidth,
    borderBottomColor: defaultColors.background,
    borderBottomWidth: 1,
    textColor: defaultColors.text,
  },
  captionContainer: {
    justifyContent: "start",
    alignItems: "start",
    paddingLeft: 5,
  },
  image: {
    flex: 1,
    height: 300,
    width: "100%",
    resizeMode: "cover",
  },
  userImage: {
    height: 35,
    width: 35,
    resizeMode: "cover",
    borderRadius: "50%",
  },
  defaultText: {
    color: defaultColors.text,
  },
  captionImage: {
    flexDirection: "row",
    width:'100%',
    alignItems:'start',
    paddingTop:10,
  },
};

export { FeedPost };

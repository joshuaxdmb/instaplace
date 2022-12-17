import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, Dimensions, Image } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../App";
import { DefaultText } from "./DefaultText";
import { defaultColors } from "../Constants/Colors";

const windowWidth = Dimensions.get("window").width;

const Comment = (props) => {
  const { comment, uid, username, userImageUrl } = props;

  return (
    <View style={styles.mainContainer}>
      <Image source={{ url: userImageUrl }} style={styles.commentImage} />
      <View style={styles.text}>
        <Text>
          <DefaultText style={{ fontWeight: "bold" }}>{username} </DefaultText>
          <DefaultText>{comment}</DefaultText>
        </Text>
      </View>
    </View>
  );
};

const styles = {
  mainContainer: {
    flexDirection: "row",
    width: "100%",
    flex:1,
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical:7,
    backgroundColor: defaultColors.background,
  },
  text: {
    backgroundColor: defaultColors.background,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 5,
    paddingLeft: 0,
    width: windowWidth,
    minHeight: 40,
  },
  commentImage:{
    height: 35,
    width: 35,
    resizeMode: "cover",
    borderRadius: 17.5,
    marginRight: 10,
    backgroundColor:defaultColors.background
  }

};

export { Comment };

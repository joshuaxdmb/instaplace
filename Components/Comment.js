import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, Dimensions } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../App";

const windowWidth = Dimensions.get("window").width;

const Comment = (props) => {
  const [username, setUsername] = useState("");
  const { comment, uid } = props;

  const getUsername = async () => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    setUsername(snap.data().name);
  };

  useEffect(() => {
    getUsername();
  }, [uid, comment]);

  return (
    <TouchableOpacity onPress={props.onSelect}>
      <View style={styles.mainContainer}>
        <Text>
          {username}: {comment}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  mainContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "start",
    padding: 5,
    paddingLeft:0,
    width: windowWidth,
    minHeight:40
  },
};

export { Comment };

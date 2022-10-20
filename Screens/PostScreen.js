/* 
Shows image and comments, and allows user to enter new comments
*/

//Imports
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  FlatList,
  Button,
  KeyboardAvoidingView,
  Platform,
  Animated
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../App";
import { AppleColorsLight } from "../Constants/Colors";
import { useSelector } from "react-redux";
import { Comment } from "../Components/Comment";
import { Ionicons } from "@expo/vector-icons";
import {RectButton } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/Swipeable';

//Global variables
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


const PostScreen = (props) => {
  //State variables
  const [comment, setComment] = useState("");
  const [postUsername, setPostUsername] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [typing, setTyping] = useState(false);
  const { postId, uid, imageUrl, caption, comments = [] } = props.route.params;
  const myId = getAuth().currentUser.uid;

  const getUsername = async () => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    setPostUsername(snap.data().name);
  };

  useEffect(() => {
    if (postComments.length === 0) {
      setPostComments(comments);
    }
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
  }, [postId]);

  const username = useSelector((state) => state.userState.currentUser.name);
  //Function definitions
  const onPost = async () => {
    if (comment === "") {
      setTyping(false);
      return;
    }
    const docRef = doc(db, "posts", uid, "userPosts", postId);
    const timestamp = Date.now();
    const id = myId + timestamp;
    const newComment = {
      uid: myId,
      comment,
      timestamp,
      id: id,
    };
    await updateDoc(docRef, {
      comments: arrayUnion(newComment),
    });
    setPostComments([...postComments, newComment]);
    setComment("");
    setTyping(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <View style={styles.commentsContainer}>
        <View style={styles.captionContainer}>
            <Text>
              {postUsername}: {caption}
            </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setTyping(false);
          }}
          style={{ paddingBottom: 5 }}
        >
          {postComments.length > 0 ? (
            <FlatList
              data={postComments}
              keyExtractor={(item) => item.id}
              renderItem={(itemData) => (
                <Swipeable renderRightActions={() => {}} rightOpenValue={100}>
                  <Comment
                    uid={itemData.item.uid}
                    comment={itemData.item.comment}
                  />
                </Swipeable>
              )}
            />
          ) : (
            <View />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.commentView}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.inputView}>
            <Text
              style={{
                textAlignVertical: "center",
                fontSize: 14,
                includeFontPadding: false,
                lineHeight: 20,
              }}
            >
              {username}:{" "}
            </Text>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter comment..."
              value={comment}
              onChangeText={setComment}
              multiline={true}
            ></TextInput>
            <Button title="Post" onPress={onPost} />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  commentsContainer: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: "column",
    width: windowWidth,
    padding: 20,
    height: windowHeight * 0.9,
  },
  captionContainer: {
    justifyContent: "start",
    alignItems: "start",
    width: "100%",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  image: {
    width: "100%",
    resizeMode: "cover",
  },
  commentView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: AppleColorsLight.gray,
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  inputStyle: {
    width: "70%",
    paddingBottom: 4,
    fontSize: 14,
  },
};

export default PostScreen;

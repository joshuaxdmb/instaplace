import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../DB";
import { AppleColorsLight, defaultColors } from "../Constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { Comment } from "../Components/Comment";
import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { updatePostComments } from "../Store/Actions/feed-actions";
import { DefaultText } from "../Components/DefaultText";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PostScreen = (props) => {
  const [comment, setComment] = useState("");
  const [postUsername, setPostUsername] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [typing, setTyping] = useState(false);
  const {
    postId,
    uid,
    imageUrl,
    caption,
    comments = [],
    userImage = null,
  } = props.route.params;
  const myId = getAuth().currentUser.uid;


  const dispatch = useDispatch();


  const getUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    return snap.data();
  };


  const getPostUsername = async () => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    setPostUsername(snap.data().name);
  };

  useEffect(() => {
    if (postComments.length === 0) {
      setPostComments(comments);
    }
    getPostUsername();
    props.navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginHorizontal: 10 }}>
          <Ionicons
            color={defaultColors.text}
            size={30}
            onPress={() => {
              props.navigation.goBack();
            }}
            name="chevron-back-outline"
          />
        </View>
      ), headerStyle:{backgroundColor:defaultColors.background},
      headerTitleStyle:{
        color:'white'
      }
    });
  }, [postId]);

  const username = useSelector((state) => state.userState.currentUser.name);
  const onPost = async () => {
    console.log('Posting your comment.')
    if (comment === "") {
      setTyping(false);
      console.log('Empty comments cannot be posted')
      return;
    }
    const docRef = doc(db, "posts", uid, "userPosts", postId);
    const timestamp = Date.now();
    const id = myId + timestamp;
    const myUserData = await getUserData(myId);
    const newComment = {
      uid: myId,
      comment,
      timestamp,
      id: id,
      username: myUserData.name,
      userImageUrl: myUserData.imageUrl 
    };
    await updateDoc(docRef, {
      comments: arrayUnion(newComment),
    });
    dispatch(updatePostComments(postId, [...postComments, newComment]));
    setPostComments([...postComments, newComment]);
    setComment("");
    setTyping(false);
  };

  const deleteComment = async (commentId) => {
    const newComments = postComments.filter((c) => {
      if (c.id !== commentId) {
        return true;
      }
    });

    const docRef = doc(db, "posts", uid, "userPosts", postId);
    await updateDoc(docRef, {
      comments: newComments,
    });

    dispatch(updatePostComments(postId, newComments));
    setPostComments(newComments);
  };

  const RenderRight = (progress, dragX, itemId) => {
    const scale = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [5, 0, 0, -5],
    });
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });

    const Style = {
      transform: [{ translateX: scale }],
    };

    return (
      <TouchableOpacity
        style={{
          width: 120,
          fontSize: 12,
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          deleteComment(itemId);
        }}
      >
      <StatusBar  barStyle="light-content" translucent={true} />
        <Animated.Text
          style={[
            Style,
            {
              color: "#fff",
              fontSize: 12,
              justifyContent: "center",
              alignItems: "center",
              width:'60%'
            },
          ]}
        >
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const RenderItem = ({ item, index, myId }) => {
    if (item.uid === myId) {
      return (
        <Swipeable
          useNativeAnimations
          overshootRight={false}
          onSwipeableOpen={() => {}}
          renderRightActions={(progress, dragX) =>
            RenderRight(progress, dragX, item.id)
          }
          disableLeftSwipe={true}
          friction={2}
        >
          <Comment
            uid={item.uid}
            comment={item.comment}
            username={item.username}
            userImageUrl={item.userImageUrl}
          />
        </Swipeable>
      );
    } else {
      return (
        <Comment
          uid={item.uid}
          comment={item.comment}
          username={item.username}
          userImageUrl={item.userImageUrl}
        />
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <Image
        style={styles.map}
        source={{url:imageUrl}}
      />
      <View style={styles.commentsContainer}>
        <View style={styles.captionContainer}>
          <Comment
            comment={caption}
            username={postUsername}
            userImageUrl={userImage}
          />
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
              renderItem={(itemData, index) => (
                <RenderItem item={itemData.item} index={index} myId={myId} />
              )}
            />
          ) : (
            <View />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.commentView}>
        <View style={styles.inputView}>
          <View
            style={{ flexDirection: "row", width: "60%", alignItems: "center" }}
          >
            <DefaultText
              style={{
                textAlignVertical: "center",
                fontSize: 14,
                includeFontPadding: false,
                lineHeight: 30,
              }}
            >
              {username}:{" "}
            </DefaultText>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter comment..."
              value={comment}
              onChangeText={setComment}
              multiline={true}
              color={defaultColors.text}
              placeholderTextColor={AppleColorsLight.gray}
            ></TextInput>
          </View>
          <TouchableOpacity onPress={onPost} style={styles.buttonView}>
            <DefaultText style={{fontWeight:'bold', color:AppleColorsLight.indigo}}>Post</DefaultText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  map: {
    height: 300,
    width: "100%",
  },
  commentsContainer: {
    backgroundColor: defaultColors.background,
    flex: 1,
    flexDirection: "column",
    width: windowWidth,
    paddingVertical: 8,
    height: windowHeight * 0.9,
  },
  image: {
    flex: 1,
    height: 300,
    width: "100%",
    resizeMode: "cover",
  },
  commentView: {
    flexDirection: "row",
    borderTopWidth: 0.25,
    borderColor: AppleColorsLight.gray,
    backgroundColor: defaultColors.background,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
    paddingHorizontal: 10,
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 30,
    width: "100%",
  },
  inputStyle: {
    paddingBottom: 4,
    fontSize: 14,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: defaultColors.background,
    justifyContent: "center",
  },

  captionContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0.25,
    borderBottomColor: AppleColorsLight.gray,
    paddingHorizontal: 0,
  },
  userImage: {
    height: 35,
    width: 35,
    resizeMode: "cover",
    borderRadius: 17.5,
    marginRight: 5,
  },
  buttonView: {
    justifyContent: "flex-end",
    padding:8
  },
  comment: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: defaultColors.background,
  },
  commentImage: {
    height: 35,
    width: 35,
    resizeMode: "cover",
    borderRadius: 17.5,
    marginRight: 10,
    backgroundColor: defaultColors.background,
  },
};

export default PostScreen;

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
  Animated,
  StatusBar
} from "react-native";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../App";
import { AppleColorsLight, defaultColors } from "../Constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { Comment } from "../Components/Comment";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { updatePostComments } from "../Store/Actions/feed-actions";
import { DefaultText } from "../Components/DefaultText";
import PopoverExample from "../Components/PopOverExample";

//Global variables
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PostScreen = (props) => {
  //State variables
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

  const onDeletePost = async()=>{
    if(myId === uid){
      const docRef= doc(db,'posts',uid,'userPosts',postId);
      await deleteDoc(docRef)
      props.navigation.goBack()
    } else {
      console.log('You tried to delete a post that is not yours.')
    }
    

  }

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
  //Function definitions
  const onPost = async () => {
    if (comment === "") {
      setTyping(false);
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
      <View style={styles.commentsContainer}>
        <View style={styles.captionImage}>
          <Image source={{ url: userImage }} style={styles.userImage} />
          <View style={styles.captionContainer}>
            <DefaultText style={styles.defaultText}>
              {postUsername}: {caption}
            </DefaultText>
          </View>
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
        <View style={{ flexDirection: "row", width:'60%', alignItems:'center' }}> 
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
          <View style={styles.buttonView}>
            <Button title="Post" color='white' onPress={onPost} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  commentsContainer: {
    backgroundColor: defaultColors.background,
    flex: 1,
    flexDirection: "column",
    width: windowWidth,
    paddingVertical: 20,
    height: windowHeight * 0.9,
  },
  captionContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5,
  },
  image: {
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
    width:'100%',
  },
  container: {
    flex: 1,
    backgroundColor: defaultColors.background,
    justifyContent: "center",
  },

  captionImage: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 0,
    paddingBottom: 10,
    borderBottomWidth:0.25,
    borderBottomColor:AppleColorsLight.gray,
    paddingHorizontal:10
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
    
  },
  comment:{
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    padding:10,
    backgroundColor:defaultColors.background
    
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

export default PostScreen;

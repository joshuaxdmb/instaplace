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
import { doc, deleteDoc, getDoc, getDocs, collection } from "firebase/firestore";
import {
  AppleColorsDark,
  AppleColorsLight,
  defaultColors,
} from "../Constants/Colors";
import { likePost, unlikePost, deletePost } from "../Store/Actions/feed-actions";
import { deleteUserPost } from "../Store/Actions/user-actions";
import { Ionicons } from "@expo/vector-icons";
import { DefaultText } from "./DefaultText";
import { PostContextMenu } from "./PostContextMenu";
import { useDispatch } from "react-redux";

const windowWidth = Dimensions.get("window").width;

const FeedPost = (props) => {
  const [postUsername, setPostUsername] = useState("");
  const [postLiked, setPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState({});
  const [likesCount, setLikesCount] = useState(null);

  const { post, id, uid, navigation } = props;
  const { caption, imageUrl, user, comments, userImage = null } = post;
  const myId = getAuth().currentUser.uid;
  let lastPress = 0;

  const dispatch = useDispatch()

  const onTouch = () => {
    navigation.navigate("PostScreen", {
      postId: id,
      uid,
      imageUrl,
      caption,
      comments,
      userImage,
    });
  };

  const onDeletePost = ()=>{
    console.log('Trying to delete post...')
    if(myId === uid){
      dispatch(deletePost(uid,id))
      dispatch(deleteUserPost(uid,id))
    } else {
      console.log('You tried to delete a post that is not yours.')
    }
  }

  const onLikePost = async () => {
    const timenow = Date.now();
    if (timenow - lastPress < 1000) {
      if (postLiked) {
        unlikePost(id, uid);
        console.log("Post unliked");
        setPostLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        likePost(id, uid);
        console.log("Post liked");
        setPostLiked(true);
        setLikesCount(likesCount + 1);
      }
    } else {
      lastPress = Date.now();
    }
  };

  const getLikes = async () => {
    const likesQuery = await getDocs(
      collection(db, "posts", uid, "userPosts", id, "likes")
    );
    const likes = {};
    likesQuery.forEach((doc) => {
      likes[doc.id] = doc.data();
    });
    setPostLikes(likes);
    setLikesCount(Object.keys(likes).length);
    if (likes[myId]) {
      setPostLiked(true);
    }
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
    getLikes();
  }, [uid, post]);

  return (
      <View style={styles.mainContainer}>
      <TouchableOpacity onPress={onLikePost} style={styles.touchableContainer}>
        {postLiked ? (
          <Ionicons
            name="ios-heart"
            color={"white"}
            size={40}
            style={{ position: "absolute", zIndex: 1, top: 10, right: 23 }}
          />
        ) : (
          <Ionicons
            name="ios-heart-outline"
            color={"white"}
            size={40}
            style={{ position: "absolute", zIndex: 1, top: 10, right: 23 }}
          />
        )}
        <Image source={{ url: imageUrl }} style={styles.image} />
        </TouchableOpacity>
        <View style={{position:"absolute", top:275,right:12}}>
        {myId === uid? <PostContextMenu onDelete={onDeletePost}/>:null}
        </View>
        <View style={styles.optionsBar}>
          <DefaultText style={{ fontWeight: "bold" }}>
            {likesCount} Likes
          </DefaultText>
        </View>
        <TouchableOpacity onPress={onTouch} style={styles.captionImage}>
          <Image source={{ url: userImage }} style={styles.userImage} />
          <View style={styles.captionContainer}>
            <Text>
              <DefaultText style={{ fontWeight: "bold" }}>
                {postUsername}{" "}
              </DefaultText>
              <DefaultText>{caption}</DefaultText>
            </Text>
            <View>
              {comments ? (
                <Text style={styles.defaultText}>
                  View {comments.length} comments
                </Text>
              ) : (
                <Text style={styles.defaultText}>Leave a comment...</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
  );
};

const styles = {
  touchableContainer:{
    backgroundColor: defaultColors.background,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: windowWidth,
    borderBottomColor: defaultColors.background,
    borderBottomWidth: 1,
    paddingHorizontal:10,
    textColor: defaultColors.text,
  },
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 5,
    paddingRight: 10,
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
    borderRadius: 17.5,
  },
  defaultText: {
    color: defaultColors.text,
  },
  captionImage: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    paddingTop: 0,
  },
  optionsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical:10
  },
};

export { FeedPost };

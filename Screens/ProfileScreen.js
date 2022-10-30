/*
Displays the current logged in user or another user based on a selection
*/

//Imports
import React, { useCallback, useEffect, useState } from "react";
import { View, Button, FlatList, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ProfilePost } from "../Components/ProfilePost";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "../App";
import {
  followUser,
  unfollowUser,
  fetchUserPosts,
} from "../Store/Actions/user-actions";
import { getAuth, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { defaultColors } from "../Constants/Colors";
import { DefaultText } from "../Components/DefaultText";

const FeedScreen = (props) => {
  //State variables
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({});
  const [following, setFollowing] = useState(false);

  //Store selectors
  const myUser = useSelector((state) => state.userState.currentUser);
  const myPosts = useSelector((state) => state.userState.posts);
  const followingList = useSelector(
    (state) => state.userState.currentUser.following
  );

  //Function definitions
  const dispatch = useDispatch();

  const onFollow = async () => {
    console.log("Follow pressed for user", user);
    if (user.id) {
      dispatch(followUser(user.id));
      setFollowing(true);
    }
  };

  const onUnfollow = () => {
    console.log("Unfollowed pressed for user", user);
    if (user.id) {
      dispatch(unfollowUser(user.id));
      setFollowing(false);
    }
  };

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        props.navigation.navigate("Landing");
      })
      .catch((e) => {
        console.log("Error logging out: ", e);
      });
  };

  const loadUser = useCallback(async () => {
    //Loads user info. Checks if the page was loaded for the logged-in user or another user
    if (!props.route.params) {
      setUser(myUser);
      console.log("Setting user to default...");
      console.log(myUser);
    } else {
      console.log("Fetching user data");
      const snap = await getDoc(doc(db, "users", props.route.params.uid));
      setUser(snap.data());
      console.log("User loaded ", snap.data());
      setUser({ ...snap.data(), id: props.route.params.uid });
    }
  }, [dispatch, props.route.params]);

  const loadProfile = useCallback(async () => {
    //Loads user posts. Checks if the page was loaded for the logged-in user or another user
    if (!props.route.params) {
      dispatch(fetchUserPosts());
      setPosts(myPosts);
    } else {
      console.log("Fetching posts for", props.route.params.uid);
      const snapshot = await getDocs(
        collection(db, "posts", props.route.params.uid, "userPosts")
      );
      const newposts = [];
      snapshot.forEach((doc) => {
        newposts.push({ data: doc.data(), id: doc.id });
      });
      setPosts(newposts);

      if (followingList.some((f) => f.uid === props.route.params.uid)) {
        console.log("You are following this user");
        setFollowing(true);
      }
    }
  }, [dispatch, props.route.params]);

  useEffect(() => {
    loadUser();
    loadProfile();
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
  }, [loadUser, dispatch, props.route.params]);

  //If posts are loaded, display them
  if (posts.length > 0) {
    return (
      <View style={styles.mainview}>
        <View style={styles.profileContainer}>
          <Image source={{ url: user.imageUrl }} style={styles.userImage} />
          <View style={styles.infoContainer}>
            <DefaultText>{user.name}</DefaultText>
            <DefaultText>{user.email}</DefaultText>
            {user.uid !== myUser.uid ? (
              <View>
                {following ? (
                  <Button title="Following" onPress={onUnfollow} />
                ) : (
                  <Button title="Follow" onPress={onFollow} />
                )}
              </View>
            ) : null}
            
          </View>
          {/* {user.uid === myUser.uid ? (
              <View>
                <Button title="Logout" onPress={logout} />
              </View>
            ) : (
              <View />
            )} */}
            
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', paddingBottom:20}}>
        <View style={{alignItems:'center', paddingHorizontal:10}}>
        <DefaultText style={{fontSize:16, fontWeight:'bold'}}>100</DefaultText>
        <DefaultText>Followers</DefaultText>
        </View>
        <View style={{alignItems:'center', paddingHorizontal:10}}>
        <DefaultText style={{fontSize:16, fontWeight:'bold'}}>{followingList.length}</DefaultText>
        <DefaultText>Following</DefaultText>
        </View>

        </View>
        
        <FlatList
          numColumns={3}
          horizontal={false}
          onRefresh={loadProfile}
          refreshing={isRefreshing}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <ProfilePost post={itemData.item.data} id={itemData.item.id} />
          )}
        />
      </View>
    );

    //If posts are not loaded, show a message
  } else {
    return (
      <View
        style={{
          ...styles.mainview,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DefaultText style={styles.defaultText}>No posts to show.</DefaultText>
      </View>
    );
  }
};

const styles = {
  mainview: {
    flex: 1,
    paddingTop: "12%",
    backgroundColor: defaultColors.background,
    paddingHorizontal:10,
  },
  infoContainer: {
    alignItems: "start",
    justifyContent: "center",
    height:70,
    marginLeft:10
  },
  defaultText: {
    color: defaultColors.text,
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: "50%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems:'start',
    justifyContent:"center",
    width:"100%",
    paddingBottom:10
  },
};

export default FeedScreen;

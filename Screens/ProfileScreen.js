/*
Displays the current logged in user or another user based on a selection
*/

//Imports
import React, { useCallback, useEffect, useState } from "react";
import { View, Button, FlatList, Image, StatusBar, Alert } from "react-native";
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
import {
  AppleColorsDark,
  AppleColorsLight,
  defaultColors,
} from "../Constants/Colors";
import { DefaultText } from "../Components/DefaultText";
import { DynamicStatusBar } from "../Components/DynamicStatusBar";
import { TouchableOpacity } from "react-native-gesture-handler";

const ProfileScreen = (props) => {
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
  const followerList = useSelector((state) => state.userState.followers);

  //Function definitions
  const dispatch = useDispatch();

  const onFollow = async () => {
    console.log("Follow pressed for user", user.name);
    if (user.id) {
      dispatch(followUser(user.id));
      setFollowing(true);
    }
  };

  const onUnfollow = async () => {
    console.log("Unfollowed pressed for user", user.name);
    if (user.id) {
      dispatch(unfollowUser(user.id));
      setFollowing(false);
    }
  };
  const onLogOutPress = () => {
    Alert.alert(
      "Logout",
      "Confirm you want to log out of your account on this device.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: logout,
          style: "destructive",
        },
      ]
    );
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
      console.log("User loaded ", snap.data().name);
      setUser({ ...snap.data(), id: props.route.params.uid });
    }
  }, [dispatch, props.route.params]);

  const loadProfile = useCallback(async () => {
    //Loads user posts. Checks if the page was loaded for the logged-in user or another user
    if (!props.route.params) {
      dispatch(fetchUserPosts());
      setPosts(myPosts);
    } else {
      console.log("Fetching posts for user", props.route.params.uid);
      const snapshot = await getDocs(
        collection(db, "posts", props.route.params.uid, "userPosts")
      );
      const newposts = [];
      snapshot.forEach((doc) => {
        newposts.push({ data: doc.data(), id: doc.id });
      });
      console.log("Loaded posts", newposts);
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
    setPosts(myPosts);
    console.log('POSTS RENDERED:', myPosts.length)
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

  const onClickPost = (postId) => {
    props.navigation.navigate("ProfileFeed", {
      userPosts: true,
      postId: postId,
      initialIndex:postId
    });
  };

  //If posts are loaded, display them
  if (posts.length > 0) {
    return (
      <View
        style={{
          ...styles.mainview,
          paddingTop: user.uid !== myUser.uid ? "4%" : "12%",
        }}
      >
        <View style={styles.topBar}>
          <View style={styles.profileContainer}>
            <Image source={{ url: user.imageUrl }} style={styles.userImage} />
            <View style={styles.infoContainer}>
              <DefaultText>{user.name}</DefaultText>
              <DefaultText>{user.email}</DefaultText>
              {user.uid !== myUser.uid ? (
                <View>
                  <DynamicStatusBar
                    barStyle="dark-content"
                    translucent={true}
                  />
                  {following ? (
                    <TouchableOpacity
                      onPress={onUnfollow}
                      style={styles.followButtons}
                    >
                      <DefaultText>Following</DefaultText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={onFollow}
                      style={styles.followButtons}
                    >
                      <DefaultText>Follow</DefaultText>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <DynamicStatusBar barStyle="light-content" translucent={true} />
              )}
            </View>
            {/* {user.uid === myUser.uid ? (
              <View>
                <Button title="Logout" onPress={logout} />
              </View>
            ) : (
              <View />
            )} */}
          </View>
          {user.uid === myUser.uid ? (
            <TouchableOpacity onPress={onLogOutPress}>
              <Ionicons
                name="exit-outline"
                color={"white"}
                size={32}
                style={{}}
              />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
            <DefaultText style={{ fontSize: 16, fontWeight: "bold" }}>
              {followerList.length}
            </DefaultText>
            <DefaultText>Followers</DefaultText>
          </View>
          <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
            <DefaultText style={{ fontSize: 16, fontWeight: "bold" }}>
              {followingList.length}
            </DefaultText>
            <DefaultText>Following</DefaultText>
          </View>
        </View>

        <FlatList
          numColumns={3}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          onRefresh={loadProfile}
          refreshing={isRefreshing}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProfilePost
              post={item.data}
              id={item.id}
              navigation={props.navigation}
              onClick={onClickPost}
            />
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
  followButtons: {
    backgroundColor: AppleColorsLight.blue,
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 90,
    alignItems: "center",
    borderRadius: 10,
  },
  topBar: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  mainview: {
    flex: 1,
    backgroundColor: defaultColors.background,
    paddingHorizontal: 10,
  },
  infoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    height: 70,
    marginLeft: 10,
  },
  defaultText: {
    color: defaultColors.text,
  },
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
};

export default ProfileScreen;

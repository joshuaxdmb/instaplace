/*
Displays the current logged in user or another user based on a selection
*/

//Imports
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Button, FlatList } from "react-native";
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
      await followUser(user.id);
      setFollowing(true);
    }
  };

  const onUnfollow = () => {
    console.log("Unfollowed pressed for user", user);
    if (user.id) {
      unfollowUser(user.id);
      setFollowing(false);
    }
  };

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        props.navigation.navigate("Login");
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

      const snap2 = await getDoc(
        doc(
          db,
          "following",
          myUser.uid,
          "userFollowing",
          myUser.uid + "-" + props.route.params.uid
        )
      );

      if (snap2.exists()) {
        setFollowing(true);
        console.log("You are following this user!");
      }
      if (followingList.includes(props.route.params.uid)) {
        console.log("This user is included in the local database.");
      }
    }
  }, [dispatch, props.route.params]);

  useEffect(() => {
    loadUser();
    loadProfile();
    props.navigation.setOptions({
      headerLeft: ()=>(
        <View style={{marginHorizontal:10}}>
            <Ionicons  color={'black'} size={30} onPress={()=>{props.navigation.goBack()}} name="chevron-back-outline"/>
            </View>)
    })
  }, [loadUser, dispatch, props.route.params]);

  //If posts are loaded, display them
  if (posts.length > 0) {
    return (
      <View style={styles.mainview}>
        <View style={styles.infoContainer}>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
          {user.uid !== myUser.uid ? (
            <View>
              {following ? (
                <Button title="Following" onPress={onUnfollow} />
              ) : (
                <Button title="Follow" onPress={onFollow} />
              )}
            </View>
          ) : null}
          {user.uid === myUser.uid ? (
            <View>
              <Button title="Logout" onPress={logout} />
            </View>
          ) : (
            <View />
          )}
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
      <View style={styles.mainview}>
        <Text>No posts to show.</Text>
      </View>
    );
  }
};

const styles = {
  mainview: {
    flex: 1,
    marginTop: "10%",
  },
  infoContainer: {
    flex: 1 / 4,
    alignItems: "center",
    justifyContent: "center",
  },
};

export default FeedScreen;

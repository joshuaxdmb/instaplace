/*
Shows posts loaded form users the logged in user is following
 */

//Imports:
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, FlatList, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FeedPost } from "../Components/FeedPost";
import { fetchFeedPosts } from "../Store/Actions/feed-actions";

//Constants"
const windowWidth = Dimensions.get("window").width;

const FeedScreen = (props) => {

  //State Variables
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Store Selectors
  const user = useSelector((state) => state.userState.currentUser);
  const feedPosts = useSelector((state) => state.feedState.posts);

  //Function Definitions
  const dispatch = useDispatch();

  const loadPosts = useCallback(() => {
    console.log("USER FETCHING:", user);
    console.log("FEED POSTS LENGTH:", feedPosts.length);
    dispatch(fetchFeedPosts());
    setIsLoading(false);
  }, [dispatch, setIsRefreshing]);

  useEffect(() => {
    console.log('useffect feed')
    setIsLoading(true);
    loadPosts();
    setIsLoading(false);
  }, [loadPosts, dispatch, user]);


  //If posts have not been loaded yet, return loading screen
  if (isLoading || feedPosts.length < 1) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  //If posts have already been loaded, return list of posts
  if (feedPosts.length > 0) {
    return (
      <View style={styles.mainview}>
        <FlatList
          onRefresh={loadPosts}
          refreshing={isRefreshing}
          data={feedPosts}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <FeedPost post={itemData.item.data} id={itemData.item.id} uid={itemData.item.uid} navigation={props.navigation}/>
          )}
        />
      </View>
    );
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
    paddingTop: "10%",
    alignItems: "center",
    backgroundColor:'white'
  },
};

export default FeedScreen;

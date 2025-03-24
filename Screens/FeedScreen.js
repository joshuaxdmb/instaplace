import React, { useCallback, useEffect, useState } from "react";
import { Text, View, FlatList, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FeedPost } from "../Components/FeedPost";
import { fetchFeedPosts } from "../Store/Actions/feed-actions";
import { useIsFocused } from "@react-navigation/native";
import { defaultColors } from "../Constants/Colors";
import { DynamicStatusBar } from "../Components/DynamicStatusBar";

const FeedScreen = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { params = {} } = props ? props.route : {};
  const { userPosts = null, postId = null, initialIndex = null } = params;

  const user = useSelector((state) => state.userState.currentUser);
  const feedPosts = useSelector((state) => state.feedState.posts);
  const myPosts = useSelector((state) => state.userState.posts);

  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  const loadPosts = useCallback(() => {
    dispatch(fetchFeedPosts());
    setIsLoading(false);
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    if (!userPosts) {
      console.log("Loading posts from all users.");
      setIsLoading(true);
      loadPosts();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, user, loadPosts, myPosts]);

  useEffect(() => {
    if (!userPosts) {
      console.log("Loading posts from all users.");
      if (!feedPosts) {
        setIsLoading(true);
        loadPosts();
      } else if (feedPosts.length === 0) {
        setIsLoading(true);
        loadPosts();
      }
    } else {
      setIsLoading(false);
      console.log("Using loaded user posts.",myPosts.length);
    }
  }, [isFocused]);

  if (isLoading) {
    return (
      <View style={{ ...styles.mainview, justifyContent: "center" }}>
        <Text style={styles.defaultText}>Loading...</Text>
      </View>
    );
  }
  
  if (feedPosts.length > 0 || userPosts) {
    return (
      <View
        style={{
          ...styles.mainview,
          paddingTop: userPosts ? 0 : "10%",
          paddingBottom: userPosts ? 10 : 0,
        }}
      >
        <DynamicStatusBar
          barStyle={userPosts ? "dark-content" : "light-content"}
          translucent={true}
        />
        <FlatList
          getItemLayout={(data, index) => ({
            length: 400,
            offset: 400 * index,
            index,
          })}
          initialScrollIndex={0}
          onRefresh={loadPosts}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          data={userPosts ? myPosts : feedPosts}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <FeedPost
              post={itemData.item.data}
              id={itemData.item.id}
              uid={itemData.item.uid}
              navigation={props.navigation}
            />
          )}
        />
      </View>
    );
  } else {
    return (
      <View style={{ ...styles.mainview, justifyContent: "center" }}>
        <Text style={styles.defaultText}>No posts to show.</Text>
      </View>
    );
  }
};

const styles = {
  mainview: {
    flex: 1,
    alignItems: "center",
    backgroundColor: defaultColors.background,
  },
  defaultText: {
    color: defaultColors.text,
  },
};

export default FeedScreen;

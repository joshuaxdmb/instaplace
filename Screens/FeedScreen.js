/*
Shows posts loaded form users the logged in user is following
 */

//Imports:
import React, { useCallback, useEffect, useState } from "react";
import { Text, View, FlatList, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FeedPost } from "../Components/FeedPost";
import { fetchFeedPosts} from "../Store/Actions/feed-actions";
import { useIsFocused } from "@react-navigation/native";
import { defaultColors } from "../Constants/Colors";

//Constants"
const windowWidth = Dimensions.get("window").width;

const FeedScreen = (props) => {

  //State Variables
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postsFeed, setPostsFeed] = useState([])

  //Store Selectors
  const user = useSelector((state) => state.userState.currentUser);
  const feedPosts = useSelector((state) => state.feedState.posts);
  
  const isFocused = useIsFocused();

  //Function Definitions
  const dispatch = useDispatch();

  const loadPosts = useCallback(() => {
    dispatch(fetchFeedPosts());
    setPostsFeed(feedPosts)
    setIsLoading(false);
  }, [dispatch,setIsLoading]);

  // const reFresh = useCallback(()=>{
  //   dispatch(forceReload())
  //   setIsLoading(false)
  // })

  // useEffect(() => {
  //   console.log('useffect feed 1')
  //   setIsLoading(true);
  //   reFresh()
  // }, [isFocused]);

  useEffect(() => {
    console.log('useffect feed 2')
    setIsLoading(true);
    loadPosts();
  }, [ dispatch, user,loadPosts]);

  useEffect(()=>{
      if(feedPosts.length === 0){
        setIsLoading(true);
        loadPosts();
      }
  },[isFocused])


  //If posts have not been loaded yet, return loading screen
  if (isLoading) {
    return (
      <View style={{...styles.mainview, justifyContent:'center'}}>
        <Text style={styles.defaultText}>Loading...</Text>
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
      <View style={{...styles.mainview, justifyContent:'center'}}>
        <Text style={styles.defaultText}>No posts to show.</Text>
      </View>
    );
  }
};

const styles = {
  mainview: {
    flex: 1,
    paddingTop: "10%",
    alignItems: "center",
    backgroundColor:defaultColors.background
  },
  defaultText:{
    color:defaultColors.text
  }
};

export default FeedScreen;

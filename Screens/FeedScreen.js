import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Button, FlatList, Dimensions } from "react-native";
import StyledButton from "../Components/StyledButton";
import Colors from "../Constants/Colors";
import { fetchUser,  } from "../Store/Actions/user-actions";
import { useDispatch, useSelector } from "react-redux";
import { FeedPost } from "../Components/FeedPost";
import { fetchUserPosts } from "../Store/Actions/user-actions";

const windowWidth = Dimensions.get("window").width;

const FeedScreen = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const user = useSelector((state) => state.userState.currentUser);
  const posts = useSelector((state)=> state.userState.posts)
  const dispatch = useDispatch();

  const loadPosts = useCallback(()=>{
    console.log('USER FETCHING:', user)
    if(user){
      dispatch(fetchUserPosts(user.uid))
    }
  },[dispatch,user])

  if(user === null){
    return(
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if(posts.length>0){
    return (
      <View style={styles.mainview}>
      <FlatList
        onRefresh={loadPosts}
        refreshing={isRefreshing}
        data={posts}
        keyExtractor={item=>item.id}
        renderItem={
          itemData=><FeedPost
            post={itemData.item.data}
            id={itemData.item.id}
          />
        }
      />
      </View>
    );
  } else {
    return(
        <View style={styles.mainview}>
          <Text>No posts to show.</Text>
        </View>
      );
  }
 
};

const styles = {
  mainview: {
    flex: 1,
    marginTop:'4%',
    alignItems:"center"
  },
};

export default FeedScreen;

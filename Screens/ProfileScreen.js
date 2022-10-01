//TODO: FETCH POSTS BASED ON USER, NOT FROM LOCAL STORE

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { Text, View, Button, FlatList } from "react-native";
import StyledButton from "../Components/StyledButton";
import Colors from "../Constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { ProfilePost } from "../Components/ProfilePost";
import { getDoc,doc, getDocs, collection } from "firebase/firestore";
import { db } from "../App";
import { followUser,unfollowUser,fetchFollowers } from "../Store/Actions/user-actions";

const FeedScreen = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [user,setUser] = useState({})
  const [posts,setPosts] = useState({})
  const [following, setFollowing] = useState(false)
  const myUser = useSelector((state) => state.userState.currentUser)
  const myPosts = useSelector((state)=> state.userState.posts)
  const followingList = useSelector((state)=>state.userState.following)
  const dispatch = useDispatch();


  const onFollow = async() =>{
    console.log('Follow pressed for user',user)
    if(user.id){
      await followUser(user.id,user.name)
      setFollowing(true)
    }
  }

  const onUnfollow = () =>{
    console.log('Unfollowed pressed for user',user)
    if(user.id){
      unfollowUser(user.id)
      setFollowing(false)
    }
  }

  const loadUser = useCallback(async()=>{
    if(!props.route.params){
      setUser(myUser)
      console.log('Setting user to default...')
    } else{
      console.log('Fetching user data')
      const snap = await getDoc(doc(db,'users',props.route.params.uid))
      setUser(snap.data())
      console.log('User loaded ', snap.data())
      setUser({...snap.data(),id:props.route.params.uid})
    }
  },[dispatch, props.route.params])

  const loadProfile = useCallback(async()=>{
    if(!props.route.params){
      setPosts(myPosts)
    } else{
      console.log('Fetching posts for', props.route.params.uid)
      const snapshot = await getDocs(collection(db, "posts", props.route.params.uid, "userPosts"));
      const newposts = [];
      snapshot.forEach((doc) => {
        newposts.push({ data: doc.data(), id: doc.id });
      });
      setPosts(newposts)

      const snap2 = await getDoc(doc(db,'following',myUser.uid,'userFollowing',myUser.uid+"-"+props.route.params.uid))

      if(snap2.exists()){
        setFollowing(true)
        console.log('You are following this user!')
      }

      if(followingList.includes(props.route.params.uid)){
        console.log("This user is included in the local database.")
      }
      
    }
  },[dispatch, props.route.params])

  useEffect(()=>{
    loadUser()
    loadProfile()
    dispatch(fetchFollowers())
  },[loadUser,dispatch,props.route.params])

  if(posts.length>0){
    return (
      <View style={styles.mainview}>
      <View style={styles.infoContainer}>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      {user.uid !== myUser.uid?(
        <View>
          {following? (
            <Button title='Following' onPress={onUnfollow}/>
          ): 
          <Button title="Follow" onPress={onFollow} />}
        </View>
      ):null}
      </View>
      <FlatList
        numColumns={3}
        horizontal={false}
        onRefresh={loadProfile}
        refreshing={isRefreshing}
        data={posts}
        keyExtractor={item=>item.id}
        renderItem={
          itemData=><ProfilePost
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
    marginTop:'10%'
  },
  infoContainer:{
    flex:1/4,
    alignItems:'center',
    justifyContent:'center'
  }
};

export default FeedScreen;

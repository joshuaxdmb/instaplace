import { db } from "../../App";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

export const FEED_POSTS_STATE_CHANGE = "FEED_POSTS_STATE_CHANGE";

export const fetchFeedPosts = () => {
  const myId = getAuth().currentUser.uid
  return async (dispatch,useSelector) => {
    const state = useSelector((state) => state.userState);
    const users = state.userState? state.userState.currentUser.following : []
    const currentPosts = state.feedState? state.feedState.posts : [] //Not used
    const posts = []
    console.log('Feed posts: ',currentPosts.length)
    for (let i = 0; i< users.length;i++ ){
      u = users[i].uid
      var snapshot = await getDocs(collection(db, "posts", u, "userPosts"));
      snapshot.forEach((doc)=>{
        posts.push({
          data:doc.data(),
          id: doc.id,
          uid:u
        })
      })
    }
    posts.sort((a,b) => {return( b.data.timestamp - a.data.timestamp)} )
    dispatch({ type: FEED_POSTS_STATE_CHANGE, posts });
  };
};




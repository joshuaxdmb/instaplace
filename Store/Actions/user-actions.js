import { db } from "../../App";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { user } from "../Reducers/user-reducers";

export const USER_STATE_CHANGE = "USER_STATE_CHANGE";
export const USER_POST_STATE_CHANGE = "USER_POST_STATE_CHANGE";
export const USER_FOLLOWING_STATE_CHANGE = "USER_FOLLOWING_STATE_CHANGE";
export const USER_FOLLOWER_STATE_CHANGE = "USER_FOLLOWER_STATE_CHANGE"

export const fetchUser = () => {
  return async (dispatch) => {
    const uid = getAuth().currentUser.uid;
    const snapshot = await getDoc(doc(db, "users", uid));
    if (snapshot.exists()) {
      dispatch({
        type: USER_STATE_CHANGE,
        currentUser: { ...snapshot.data(), uid },
      });
    } else {
      console.log("User snapshot does not exist for",uid);
    }
  };
};

export const fetchUserPosts = (uid) => {
  return async (dispatch) => {
    const snapshot = await getDocs(collection(db, "posts", uid, "userPosts"));
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ data: doc.data(), id: doc.id });
    });
    dispatch({ type: USER_POST_STATE_CHANGE, posts });
  };
};

export const followUser = async (uid) => {
  const myId = getAuth().currentUser.uid;
  const currentUser = await getDoc(doc(db,'users',myId));
  await setDoc(doc(db,'users',myId), {
    following: [...currentUser.following, {uid:uid, timestamp:serverTimestamp()} ]
  },{merge:true});
  console.log("User followed.")
};

export const unfollowUser = async (uid) => {
  const myId = getAuth().currentUser.uid;
  const currentUser = await getDoc(doc(db,'users',myId));
  const currentFollowing = currentUser.following
  const newFollowing = []
  currentFollowing.forEach(i=>{
    if(i.uid !== uid )[
        newFollowing.push(i)
    ]
  })
  await setDoc(doc(db,'users',myId),{
    following: newFollowing},{merge:true}
  )
  console.log("User unfollowed.")
};

export const fetchFollowing = () =>{
    return async(dispatch) => {
        const uid = getAuth().currentUser.uid
        const snapshot = await getDocs(collection(db,"following",uid,'userFollowing'))
        const following = []
        snapshot.forEach((doc)=>{
            following.push(
                doc.data().uid)
        })
        dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
    }
}

export const fetchFollowers = () => {

}
import { db } from "../../DB";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { async } from "@firebase/util";

export const USER_STATE_CHANGE = "USER_STATE_CHANGE";
export const USER_POST_STATE_CHANGE = "USER_POST_STATE_CHANGE";
export const USER_FOLLOWING_STATE_CHANGE = "USER_FOLLOWING_STATE_CHANGE";
export const USER_FOLLOWER_STATE_CHANGE = "USER_FOLLOWER_STATE_CHANGE";
export const USER_UNFOLLOWING_STATE_CHANGE = "USER_UNFOLLOWING_STATE_CHANGE";

export const fetchUser = () => {
  return async (dispatch) => {
    const uid = getAuth().currentUser.uid;
    const snapshot2 = await getDocs(collection(db,'userFollowers',uid,'followers'))
    const followers = []
    snapshot2.forEach((doc)=>{
      followers.push(doc.data())
    })
    const snapshot = await getDoc(doc(db, "users", uid));
    if (snapshot.exists()) {
      dispatch({
        type: USER_STATE_CHANGE,
        currentUser: { ...snapshot.data(), uid },
        followers
      });
    } else {
      console.log("User snapshot does not exist for", uid);
    }
  };
};

export const fetchUserPosts = () => {
  const uid = getAuth().currentUser.uid;
  console.log("Fetching user posts for ", uid);
  return async (dispatch) => {
    const snapshot = await getDocs(collection(db, "posts", uid, "userPosts"));
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ data: doc.data(), id: doc.id ,uid});
    });
    posts.sort((a, b) => {
      return b.data.timestamp - a.data.timestamp;
    });
    dispatch({ type: USER_POST_STATE_CHANGE, posts });
  };
};

export const deleteUserPost = (uid,postId) =>{
  return async(dispatch, useSelector)=>{
    const docRef= doc(db,'posts',uid,'userPosts',postId);
    const snap = await deleteDoc(docRef)
    console.log('Post deleted.')
    const state = useSelector((state) => state.userState);
    const currentPosts = state.feedState? state.userState.posts : []

    const posts = []

    currentPosts.forEach(p=>{
      if(p.id !== postId){
        posts.push(p)
      }
    })

    dispatch({ type: USER_POST_STATE_CHANGE, posts })

  }
}

export const followUser = (uid) => {
  return async (dispatch, getState) => {
    const myId = getAuth().currentUser.uid;
    const currentUser = await getDoc(doc(db, "users", myId));
    const otherUser = await getDoc(doc(db,'users',uid));
    const currentFollowing = [...currentUser.data().following];
    const otherUserFolloers = [...otherUser.data().followers]
    if (currentFollowing.some((f) => f.uid === uid)) {
      console.log("Already following this user");
    } else {
      const timestamp = Date.now();
      await setDoc(
        doc(db, "users", myId),
        {
          following: [...currentFollowing, { uid: uid, timestamp: timestamp }],
        },
        { merge: true }
      );
      await setDoc(doc(db, "users", uid), {
        followers:[...otherUserFolloers,{uid:myId, timestamp:timestamp}]
      }, {merge:true});
      const newFollower = { uid, timestamp };
      dispatch({ type: USER_FOLLOWING_STATE_CHANGE, newFollower: newFollower });
    }
  };
};

export const unfollowUser = (uid) => {
  return async (dispatch) => {
    console.log("Unfollowing");
    const myId = getAuth().currentUser.uid;
    const currentUser = await getDoc(doc(db, "users", myId));
    const otherUser = await getDoc(doc(db,'users',uid));
    const currentFollowing = [...currentUser.data().following];
    const otherUserFollowers = [...otherUser.data().followers]
    const newFollowing = [];
    const newFollowers = [];
    currentFollowing.forEach((i) => {
      if (i.uid !== uid) {newFollowing.push(i)};
    });
    otherUserFollowers.forEach(i=>{
      if(i.uid !== myId){newFollowers.push(i)}
    })
    await setDoc(
      doc(db, "users", myId),
      {
        following: newFollowing,
      },
      { merge: true }
    );
    await setDoc(
      doc(db, "users", uid),
      {
        followers: newFollowers,
      },
      { merge: true }
    );

    
  };
};

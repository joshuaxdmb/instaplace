import { db } from "../../DB";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const FEED_POSTS_STATE_CHANGE = "FEED_POSTS_STATE_CHANGE";
export const FORCE_RELOAD = "FORCE_RELOAD"

export const forceReload = () =>{
    return async(dispatch)=>{
      dispatch({type:FORCE_RELOAD})
    }
    
}

export const fetchFeedPosts = () => {
  const myId = getAuth().currentUser.uid;
  return async (dispatch, useSelector) => {
    const state = useSelector((state) => state.userState);
    const users = state.userState ? [...state.userState.currentUser.following] : [];
    users.push({uid:myId})
    const currentPosts = state.feedState ? state.feedState.posts : []; //Not used
    const posts = [];
    for (let i = 0; i < users.length; i++) {
      u = users[i].uid;
      const snapshot = await getDocs(collection(db, "posts", u, "userPosts"));
      snapshot.forEach((doc) => {
        posts.push({
          data: doc.data(),
          id: doc.id,
          uid: u,
        });
      });
    }

    uniquePosts = posts.filter((item,index)=>posts.indexOf((item)===index))
    uniquePosts.sort((a, b) => {
      return b.data.timestamp - a.data.timestamp;
    });
    dispatch({ type: FEED_POSTS_STATE_CHANGE,uniquePosts});
  };
};

export const likePost = async(postId, postUid) =>{
    myId = getAuth().currentUser.uid
    const timestamp = Date.now()
    await setDoc(doc(db,'posts',postUid,'userPosts',postId,'likes',myId),{
      timestamp,
      uid:myId
    })

    const likesQuery = await getDoc(doc(db,'posts',postUid,'userPosts',postId))
    const currentLikesCount = likesQuery.data().likesCount

    await updateDoc(doc(db,'posts',postUid,'userPosts',postId),{
      likesCount:currentLikesCount+1
    })
}

export const deletePost = (uid,postId) =>{
  return async(dispatch, useSelector)=>{
    const docRef= doc(db,'posts',uid,'userPosts',postId);
    const snap = await deleteDoc(docRef)
    console.log('Post deleted.')
    const state = useSelector((state) => state.feedState);
    const currentPosts = state.feedState? state.feedState.posts : []

    const posts = []

    currentPosts.forEach(p=>{
      if(p.id !== postId){
        posts.push(p)
      }
    })

    dispatch({ type: FEED_POSTS_STATE_CHANGE, uniquePosts:posts })

  }
}

export const unlikePost = async(postId, postUid) =>{
    myId = getAuth().currentUser.uid
    const timestamp = Date.now()
    await deleteDoc(doc(db,'posts',postUid,'userPosts',postId,'likes',myId),{
      timestamp,
      uid:myId
    })
    const likesQuery = await getDoc(doc(db,'posts',postUid,'userPosts',postId))
    const currentLikesCount = likesQuery.data().likesCount

    await updateDoc(doc(db,'posts',postUid,'userPosts',postId),{
      likesCount:currentLikesCount-1
    })
  }

export const updatePostComments = (postId, newComments) => {
  return (dispatch, useSelector) => {
    const state = useSelector((state) => state.feedState);
    const currentPosts = state.feedState? state.feedState.posts : []

    const posts = [];

    currentPosts.forEach((p) => {
      if (p.id === postId) {
        console.log('GOT IT')
        posts.push({ ...p, data:{...p.data,comments:newComments}});
      } else posts.push(p);
    });

    if (posts.length === currentPosts.length && posts.length>0) {
      dispatch({ type: FEED_POSTS_STATE_CHANGE, uniquePosts:posts });
    } else {
      console.log(
        "ERROR: The number of new posts does not match the old number"
      );
    }
  };
};

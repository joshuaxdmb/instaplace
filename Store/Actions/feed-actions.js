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
import { useSelector } from "react-redux";

export const OTHER_USERS_STATE_CHANGE = "OTHER_USERS_STATE_CHANGE";
export const OTHER_USERS_POSTS_STATE_CHANGE = "OTHER_USERS_POST_STATE_CHANGE";

export const fetchOtherUserPosts = (uid) => {
  return async (dispatch) => {
    const snapshot = await getDocs(collection(db, "posts", uid, "userPosts"));
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ data: doc.data(), id: doc.id });
    });
    dispatch({ type: USER_POST_STATE_CHANGE, posts });
  };
};

export const fetcFollowingPosts = () => {
  return async (dispatch, useSelector) => {
    const found = getState().usersState.users.some((el) => {
      el.uid === uid;
    });
    if (!found) {
      const snapshot = await getDoc(doc(db, "users", uid));
      if (snapshot.exists()) {
        dispatch({
          type: USERS_STATE_CHANGE,
          newUser: { ...snapshot.data(), uid },
        });
      } else {
        console.log("User snapshot does not exist for", uid);
      }
    }
  };
};



import {
  USER_STATE_CHANGE,
  USER_POST_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_UNFOLLOWING_STATE_CHANGE
} from "../Actions/user-actions";
const initialState = {
  currentUser: {following:[]},
  posts: [],
  followers:[]
};

export const user = (state = initialState, action) => {
  console.log("User reducer called.", action.type);
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
        followers:action.followers
      };
    case USER_POST_STATE_CHANGE:
      console.log('THE NEW POSTS',action.posts.length)
      return {
        ...state,
        posts: [...action.posts],
      };

    case USER_FOLLOWING_STATE_CHANGE:
      return {
        ...state,
        following: [...state.currentUser.following, action.newFollower],
      };
    case USER_UNFOLLOWING_STATE_CHANGE:
      return{
        ...state,
        following: action.newFollowing
      }
    default:
      return {
        ...state,
      };
  }
};

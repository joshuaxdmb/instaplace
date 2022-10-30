import { FEED_POSTS_STATE_CHANGE, FORCE_RELOAD } from "../Actions/feed-actions";
const initialState = {
  posts: [],
};

export const feed = (state = initialState, action) => {
  console.log("Feed reducer called.", action.type);
  switch (action.type) {
    case FEED_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.uniquePosts,
      };
    case FORCE_RELOAD:
      return{
        ...state,
        posts: [...state.posts]
      }
    default:
      return {
        ...state,
      };
  }
};

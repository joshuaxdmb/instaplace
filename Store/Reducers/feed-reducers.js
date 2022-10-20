import { FEED_POSTS_STATE_CHANGE } from "../Actions/feed-actions";
const initialState = {
  posts: [],
};

export const feed = (state = initialState, action) => {
  console.log("Feed reducer called.", action.type);
  switch (action.type) {
    case FEED_POSTS_STATE_CHANGE:
      console.log("Feed reducer called.", action.posts)
      return {
        ...state,
        posts: action.posts,
      };
    default:
      return {
        ...state,
      };
  }
};

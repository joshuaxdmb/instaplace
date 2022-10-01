import { USER_STATE_CHANGE, USER_POST_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from "../Actions/user-actions"
const initialState ={
    currentUser:null,
    posts:[],
    following:[],
    followers:[]
}

export const user = (state=initialState,action) =>{
    console.log(
        'user reducer called.',action.currentUser,action.type
    )
    switch(action.type){
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser:action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return{
                ...state,
                posts:action.posts
            }
        
        case USER_FOLLOWING_STATE_CHANGE:
            return{
                ...state,
                following:action.following
            }
        default:
            return{
                ...state
            }

    }
    
}


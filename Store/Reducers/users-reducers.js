import { USERS_STATE_CHANGE, USERS_POSTS_STATE_CHANGE} from "../Actions/other-users-actions"
const initialState ={
    users:[],
    posts:[],
    usersCount:0
}

export const users = (state=initialState,action) =>{
    console.log(
        'user reducer called.',action.newUser,action.type
    )
    switch(action.type){
        case USERS_STATE_CHANGE:
            return {
                ...state,
                users:[...state.users,action.newUser]
            }
        case USERS_POSTS_STATE_CHANGE:
            return{
                ...state,
                posts:action.posts
            }
    
        default:
            return{
                ...state
            }

    }
    
}


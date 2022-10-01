import {combineReducers} from 'redux'
import {user} from './user-reducers'
import { users } from './users-reducers'

export const rootReducer = combineReducers({
    userState: user,
    usersState: users
})
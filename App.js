import AppNavigator from './Navigation/AppNavigator'
import {FeedScreen} from './Screens/FeedScreen'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import ReduxThunk from 'redux-thunk'

import { getAuth } from "firebase/auth";
import { user } from "./Store/Reducers/user-reducers";
import { feed } from "./Store/Reducers/feed-reducers";

const reducer = combineReducers({
  userState:user,
  feedState:feed
})

const store = createStore(reducer, applyMiddleware(ReduxThunk))

export default function App() {
  if (getAuth().currentUser) {
    return <FeedScreen />;
  }
  return (
    <Provider store={store}>
      <AppNavigator/>
    </Provider>
  );
}



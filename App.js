import { StyleSheet} from "react-native";
import AppNavigator from './Navigation/AppNavigator'
import {FeedScreen} from './Screens/FeedScreen'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import ReduxThunk from 'redux-thunk'

import { getAuth } from "firebase/auth";
import { user } from "./Store/Reducers/user-reducers";
import { feed } from "./Store/Reducers/feed-reducers";


//const db = getFirestore(app);
//const storage = getStorage(app, 'gs://instaplace-c6e04.appspot.com/')

const reducer = combineReducers({
  userState:user,
  feedState:feed
})

const store = createStore(reducer, applyMiddleware(ReduxThunk))
// const store  = configureStore({
//   reducer,
//   middleware:(getDefaultMiddleware)=>getDefaultMiddleware({ReduxThunk})
// })

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});



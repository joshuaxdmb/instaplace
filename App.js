import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppNavigator from './Navigation/AppNavigator'
import {FeedScreen} from './Screens/FeedScreen'

import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {rootReducer} from './Store/Reducers/index'
import ReduxThunk from 'redux-thunk'

import { FIREBASE_API_KEY } from "@env";

import { getAuth } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "instaplace-c6e04.firebaseapp.com",
  projectId: "instaplace-c6e04",
  storageBucket: "instaplace-c6e04.appspot.com",
  messagingSenderId: "812581881503",
  appId: "1:812581881503:web:311e6de62b58a1eec444aa",
  measurementId: "G-CPNK72QQW5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app, 'gs://instaplace-c6e04.appspot.com/')



const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

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

export {db, storage}

/* 
Allows users with existing credentials to login to the app and the database (login is handled by Firebase)
*/


//Imports
import React, { useState } from "react";
import { View,TextInput } from "react-native";
import StyledButton from "../Components/StyledButton";
import {Colors,AppleColorsLight as AppleColors} from '../Constants/Colors'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fetchUser, fetchUserPosts} from "../Store/Actions/user-actions";
import { useDispatch } from "react-redux";
import { fetchFeedPosts } from "../Store/Actions/feed-actions";


const LoginScreen = (props) => {
  //State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Function definitions
  const dispatch = useDispatch();

  const onSignUp = async() => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        dispatch(fetchUser())
        dispatch(fetchUserPosts())
        dispatch(fetchFeedPosts())
        console.log('here3')
        props.navigation.navigate("Main");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
      });
  };

  return (
    <View style={styles.mainview}>
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
        style={styles.input}
        autoCapitalize={'none'}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
        style={styles.input}
        autoCapitalize={'none'}
      />
      <StyledButton title="Log In" onPress={onSignUp} color={Colors.indigo} />
    </View>
  );
};
const styles = {
  mainview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    boderColor: "black",
    borderWidth: 1,
    borderRadius: 2,
    margin: 5,
    width:"60%",
    height:'5%',
    padding:2
  },
};

export default LoginScreen;

import React, { useState } from "react";
import { View,TextInput } from "react-native";
import StyledButton from "../Components/StyledButton";
import {Colors, AppleColorsLight, defaultColors} from '../Constants/Colors'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { fetchUser, fetchUserPosts} from "../Store/Actions/user-actions";
import { useDispatch } from "react-redux";
import { fetchFeedPosts } from "../Store/Actions/feed-actions";


const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const onSignUp = async() => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch(fetchUser())
        dispatch(fetchUserPosts())
        dispatch(fetchFeedPosts())
        props.navigation.navigate("Main");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  return (
    <View style={styles.mainview}>
      <TextInput
        placeholder="joshuaxd@gmail.com"
        onChangeText={(email) => setEmail(email)}
        style={styles.input}
        autoCapitalize={'none'}
        color='white'
        placeholderTextColor={AppleColorsLight.gray}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
        style={styles.input}
        autoCapitalize={'none'}
        color='white'
        placeholderTextColor={AppleColorsLight.gray}
      />
      <StyledButton title="Log In" onPress={onSignUp} color={Colors.indigo} style={{margin:20}} />
    </View>
  );
};
const styles = {
  mainview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:defaultColors.background
  },
  input: {
    backgroundColor: defaultColors.background,
    borderColor:'white',
    borderWidth: 1,
    borderRadius: 4,
    margin: 5,
    width:"60%",
    height:'5%',
    padding:3,
    paddingLeft:10,
    placeholderTextColor:AppleColorsLight.gray,
  },
};

export default LoginScreen;

/*
Allows the user to register for the app. This creates a user in Firebase.
*/

//Imports
import React, { useState } from "react";
import { View, TextInput } from "react-native";
import StyledButton from "../Components/StyledButton";
import { Colors} from "../Constants/Colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {setDoc} from "firebase/firestore";
import { db } from "../App";
import { useDispatch } from "react-redux";
import { fetchUser, fetchUserPosts, fetchFollowers } from "../Store/Actions/user-actions";

const RegisterScreen = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()

  const onSignUp = async () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setDoc(doc(db, "users",userCredential.user.uid), {
          name,
          email,
          following:[],
          followers:[]
        });
        // Signed in
        dispatch(fetchUser());
        dispatch(fetchUserPosts(userCredential.user.uid));
        dispatch(fetchFollowers());
        props.navigation.navigate("Main");
        // ...
      })
      .catch((error) => {
        console.log(error);
        // ..
      });
  };

  return (
    <View style={styles.mainview}>
      <TextInput
        placeholder="Name"
        onChangeText={(name) => setName(name)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
        style={styles.input}
      />
      <StyledButton title="Sign Up" onPress={onSignUp} color={Colors.indigo} />
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
    width: "60%",
    height: "5%",
    padding: 2,
  },
};

export default RegisterScreen;

/*
Allows the user to register for the app. This creates a user in Firebase.
*/

//Imports
import React, { useEffect, useState } from "react";
import { View, TextInput } from "react-native";
import StyledButton from "../Components/StyledButton";
import { AppleColorsLight, Colors} from "../Constants/Colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {setDoc, doc} from "firebase/firestore";
import { storage, db } from "../DB";
import { useDispatch } from "react-redux";
import { fetchUser, fetchUserPosts, fetchFollowers } from "../Store/Actions/user-actions";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Image as ImageCompress } from "react-native-compressor";



const RegisterScreen = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] =useState(null);
 
  const dispatch = useDispatch()

  useEffect(()=>{
    if(props.route.params){
      setImage(props.route.params.image.substring(7))
      console.log('IMAGE SET', props.route.params.image.substring(7))
      uploadImage(props.route.params.image.substring(7))
    }

  },[props])

  const onSignUp = async () => {
    if(!imageUrl){
      return
    }
    const auth = getAuth();
    console.log(imageUrl)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setDoc(doc(db, "users",userCredential.user.uid), {
          name,
          email,
          following:[],
          followers:[],
          imageUrl:imageUrl
        });
        dispatch(fetchUser());
        dispatch(fetchUserPosts(userCredential.user.uid));
        props.navigation.navigate("Main");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const selectImage = () =>{
    props.navigation.navigate('AddProfilePhoto')
  }

  const uploadImage = async (image) => {
    const compressedImage = await ImageCompress.compress(image,{maxWidth:500,quality:0.8});
    const imageFile = await fetch(compressedImage);
    const blob = await imageFile.blob();
    const imageRef = ref(storage, `profiles/${image.substring(image.length - 40)}`);
    const uploadTask = await uploadBytesResumable(imageRef, blob, {
      contentType: "image/jpeg",
    }).then(async (snapshot) => {
      console.log('Image uploaded successfully.')
      const url = await getDownloadURL(snapshot.ref);
      setImageUrl(url);
      return(url)
    }).catch(e=>{
      console.log('Eror: ',e)
    })

   
  }; 


  return (
    <View style={styles.mainview}>
      <StatusBar  barStyle="light-content" translucent={true} />
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
      {image? <StyledButton title="Image Selected" onPress={selectImage} color={AppleColorsLight.cyan} style={{width:200,marginBottom:10,marginTop:10}}/>
      : <StyledButton title="Add Profile Picture" onPress={selectImage} color={AppleColorsLight.blue} style={{width:200,marginBottom:10,marginTop:10}}/>}
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

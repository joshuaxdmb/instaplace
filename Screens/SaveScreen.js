/*
After the picture is taken, this screen allows the user to enter a caption and save the post to their profile
*/

//Imports
import React, { useCallback, useEffect, useState } from "react";
import {Image as ImageCompress} from 'react-native-compressor'
import { View, Button, TextInput, Image } from "react-native";
import { fetchUser, fetchUserPosts } from "../Store/Actions/user-actions";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../App";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DynamicStatusBar } from "../Components/DynamicStatusBar";

const SaveScreen = (props) => {

  //State variables
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saveDisabled,setSaveDisabled] = useState(false)

  //Store selectors
  const user = useSelector((state) => state.userState);

  //Function definitions
  const image = props.route.params.image.substring(0,2)==='ph'?props.route.params.image:props.route.params.image.substring(7);
  const uid = getAuth().currentUser.uid;

  const dispatch = useDispatch();

  const loadUser = useCallback(() => {
    if (!user.currentUser) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    console.log('Saving image',image)
    loadUser();
  }, [loadUser]);

  const uploadImage = async () => {
    setSaveDisabled(true)
    const imageFile = await fetch(image)
    const blob = await imageFile.blob()
    let imageRef = null
    if(image.substring(0,2) !== 'ph'){
      imageRef = ref(storage, `posts/${uid}/${image.substring(image.length - 40)}`);
    } else{
      imageRef = ref(storage, `posts/${uid}/${image.substring(5)}`);
    }
    
    console.log('Uploading for user ',user.currentUser.name)
    const uploadTask = uploadBytesResumable(imageRef, blob, {
      contentType: "image/jpeg",
    }).then(async (snapshot) => {
      const url = await getDownloadURL(snapshot.ref);
      setImageUrl(url);
      const docRef = await addDoc(collection(db, "posts", uid, "userPosts"), {
        caption: caption,
        imageUrl: url,
        timestamp: serverTimestamp(),
        user:user.currentUser.name,
        userImage:user.currentUser.imageUrl
      });
      console.log("Post created with id:", docRef.id);
      props.navigation.navigate('Profile');
      dispatch(fetchUserPosts(uid))
    }).catch(e=>{
      console.log('Eror: ',e)
    })
  }; 

  return (
    <View style={styles.mainview}>
    <DynamicStatusBar  barStyle="dark-content" translucent={true}/>
      <Image source={{ uri: image }} style={{ flex: 1 }} />
      <View style={styles.inputView}>
        <TextInput
          placeholder="Write a caption"
          onChangeText={(caption) => {
            setCaption(caption);
          }}
        />
        <Button title="Save" onPress={uploadImage} style={styles.button}  disabled={saveDisabled}/>
      </View>
    </View>
  );
};

const styles = {
  mainview: {
    flex: 1,
  },
  button: {
    marginBottom: 30,
  },
  inputView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop:20
  },
};

export default SaveScreen;

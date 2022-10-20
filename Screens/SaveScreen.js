/*
After the picture is taken, this screen allows the user to enter a caption and save the post to their profile
*/

//Imports
import React, { useCallback, useEffect, useState } from "react";
import { View, Button, TextInput, Image } from "react-native";
import { fetchUser, fetchUserPosts } from "../Store/Actions/user-actions";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../App";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SaveScreen = (props) => {

  //State variables
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  //Store selectors
  const user = useSelector((state) => state.userState);

  //Function definitions
  const image = props.route.params.image.substring(7);
  const uid = getAuth().currentUser.uid;

  const dispatch = useDispatch();

  const loadUser = useCallback(() => {
    if (!user.currentUser) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const uploadImage = async () => {
    const imageFile = await fetch(image);
    const blob = await imageFile.blob();
    const imageRef = ref(storage, `posts/${uid}/${image.substring(image.length - 40)}`);
    console.log('Uploading for user ',user.currentUser)
    const uploadTask = uploadBytesResumable(imageRef, blob, {
      contentType: "image/jpeg",
    }).then(async (snapshot) => {
      const url = await getDownloadURL(snapshot.ref);
      setImageUrl(url);
      const docRef = await addDoc(collection(db, "posts", uid, "userPosts"), {
        caption: caption,
        imageUrl: url,
        timestamp: serverTimestamp(),
        user:user.currentUser.name
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
      <Image source={{ uri: image }} style={{ flex: 1 }} />
      <View style={styles.inputView}>
        <TextInput
          placeholder="Write a caption"
          onChangeText={(caption) => {
            setCaption(caption);
          }}
        />
        <Button title="Save" onPress={uploadImage} style={styles.button} />
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
    justifyContent: "start",
    marginTop:20
  },
};

export default SaveScreen;

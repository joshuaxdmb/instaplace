import React, { useCallback, useEffect, useState } from "react";
import { View, TextInput, Image } from "react-native";
import { fetchUser, fetchUserPosts } from "../Store/Actions/user-actions";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../DB";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DynamicStatusBar } from "../Components/DynamicStatusBar";
import { LocationPicker } from "../Components/LocationPicker";
import StyledButton from "../Components/StyledButton";
import { AppleColorsLight, defaultColors } from "../Constants/Colors";
import { Ionicons } from "@expo/vector-icons";
const SaveScreen = (props) => {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saveDisabled,setSaveDisabled] = useState(false);
  const [location, setLocation] = useState (null)

  const user = useSelector((state) => state.userState);

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
    props.navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginHorizontal: 10 }}>
          <Ionicons
            color={"white"}
            size={30}
            onPress={() => {
              props.navigation.goBack();
            }}
            name="chevron-back-outline"
          />
        </View>
      ),
      headerStyle: { backgroundColor: defaultColors.background },
      headerTitleStyle: {
        color: "white",
      },
    });

  }, [loadUser]);

  const uploadImage = async () => {
    if(!location){
      return
    }
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
        userImage:user.currentUser.imageUrl,
        location:location
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
    <DynamicStatusBar  barStyle="light-content" translucent={true}/>
      <Image source={{ uri: image }} style={{ flex: 1 }} />
      <View style={styles.inputView}>
        <TextInput
          placeholder="Write a caption"
          color='white'
          onChangeText={(caption) => {
            setCaption(caption);
          }}
          placeholderTextColor={AppleColorsLight.gray}
        />
        <LocationPicker locationSet = {setLocation}/>
        <StyledButton title="Save" onPress={uploadImage} style={styles.button} color={AppleColorsLight.indigo}  disabled={saveDisabled}/>
      </View>
    </View>
  );
};

const styles = {
  mainview: {
    flex: 1,
    backgroundColor: defaultColors.background
  },
  button: {
    marginTop: 30,
  },
  inputView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop:20
  },
};

export default SaveScreen;

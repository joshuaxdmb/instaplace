/*
  Screen to take picture
*/

import { Camera, CameraType } from "expo-camera";
import { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const AddScreen = (props) => {
  //State variables
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCameta] = useState(null);
  const [image, setImage] = useState(null);

  //Function definitions
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      console.log(data.uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const saveImage= uri =>{
    props.navigation.navigate('Save',{
      image
    })
  }

  const toggleCameraType = ()=> {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  useEffect(()=>{
    props.navigation.setOptions({
      headerLeft: ()=>(
        <View style={{marginHorizontal:10}}>
            <Ionicons  color={'black'} size={30} onPress={()=>{props.navigation.goBack()}} name="chevron-back-outline"/>
            </View>)
    })
  },[image])


  //If there is no permission to access teh camera, return an empty view
  if (!permission) {
    return <View />;
  }
  //If the permission object exists but it is not granted, show user what is happening and allow them to grant permission
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={type}
          ratio={"1:1"}
          ref={(ref) => {
            setCameta(ref);
          }}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.text}>Pick Image</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      {image && (
        <ImageBackground source={{ uri: image }} style={{flex:1}}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={saveImage}>
              <Text style={styles.text}>Save Image</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    aspectRatio: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  mainView: {
    width: "100%",
    height: "100%",
  },
});

export default AddScreen;

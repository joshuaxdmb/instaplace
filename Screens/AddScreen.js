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
  ImageBackground,
  FlatList,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AppleColorsLight, defaultColors } from "../Constants/Colors";
import * as MediaLibrary from "expo-media-library";
import { useIsFocused } from "@react-navigation/native";
import { MediaItem } from "../Components/MediaItem";
import { Image as ImageCompress } from "react-native-compressor";
import { DefaultText } from "../Components/DefaultText";
import * as Location from 'expo-location'
import StyledButton from "../Components/StyledButton";

const AddScreen = (props) => {
  //State variables
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [status, requestMediaPermission] = MediaLibrary.usePermissions();
  const [camera, setCameta] = useState(null);
  const [image, setImage] = useState(null);
  const [media, setMedia] = useState([]);

  const isFocused = useIsFocused();

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

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const saveImage = async () => {
    let { locationStatus } = await Location.requestForegroundPermissionsAsync(); //Reques location permissions if not yet granted
    const compressedImage = await ImageCompress.compress(image, {
      maxWidth: 800,
      quality: 0.8,
    });
    props.navigation.navigate("Save", {
      image: compressedImage,
    });
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const getMedia = async () => {
    const mediaRequest = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: MediaLibrary.SortBy.creationTime,
    });
    setMedia(mediaRequest.assets);
  };

  useEffect(() => {
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
    if (permission && status) {
      console.log("Permissions created");
      if (!permission.granted || !status.granted) {
        console.log("Requesting permissions");
        requestPermissions();
        getMedia();
      } else if (status.granted) {
        getMedia();
      }
    }
    console.log("Current image", image);
  }, [image, isFocused, permission, status]);

  const selectMedia = (url) => {
    console.log("Media selected", url);
    setImage(url);
    console.log(image);
  };

  const requestPermissions = async () => {
    await requestPermission();
    await requestMediaPermission();
  };

  //If there is no permission to access the camera, return an empty view
  if (!permission || !status) {
    return <View />;
  }
  //If the permission object exists but it is not granted, show user what is happening and allow them to grant permission
  else if (!permission.granted || !status.granted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" translucent={true} />

        <DefaultText style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </DefaultText>
        <StyledButton onPress={requestPermissions} title="Grant permission" color={AppleColorsLight.indigo} style={{margin:20, width:200}} />
      </View>
    );
  }

  return (
    <View style={styles.mainView}>
      <StatusBar barStyle="light-content" translucent={true} />
      <View style={styles.container}>
        {image ? (
          <ImageBackground source={{ uri: image }} style={styles.camera}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Ionicons
                  color={"white"}
                  size={30}
                  name="camera-reverse-outline"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setImage(null)}
              >
                <Ionicons color={"white"} size={30} name="camera-outline" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={saveImage}>
                <Ionicons
                  color={AppleColorsLight.blue}
                  size={30}
                  name="add-circle"
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <Camera
            style={styles.camera}
            type={type}
            ratio={"1:1"}
            ref={(ref) => {
              setCameta(ref);
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Ionicons
                  color={"white"}
                  size={30}
                  name="camera-reverse-outline"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Ionicons color={"white"} size={30} name="camera-outline" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Ionicons color={"white"} size={30} name="image-outline" />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
      {false && (
        <ImageBackground source={{ uri: image }} style={{ flex: 1 }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={saveImage}>
              <Text style={styles.text}>Save Image</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {media.length > 0 ? (
        <View style={styles.container}>
          <FlatList
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            data={media}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <MediaItem
                post={{ caption: "", imageUrl: itemData.item.uri }}
                id={""}
                onPress={selectMedia}
              />
            )}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.background,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: defaultColors.background,
    alignItems:'center',
    justifyContent:'center'
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

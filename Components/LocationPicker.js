import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { AppleColorsLight } from "../Constants/Colors";
import { DefaultText } from "./DefaultText";

const LocationPicker = (props) => {
  const [locationText, setLocationText] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let description = await Location.reverseGeocodeAsync(location.coords);
      setLocationText(description[0].name);
      props.locationSet({text:description[0].name, latitude:location.coords.latitude,longitude:location.coords.longitude});
    })();
  }, []);

  const onGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let description = await Location.reverseGeocodeAsync(location.coords);
    console.log(description);
    setLocationText(description[0].name);
  }

  return (
    <View style={styles.screenContainer}>
      {locationText ? (
        <View>
          <DefaultText>{locationText}</DefaultText>
        </View>
      ) : (
        <TouchableOpacity style={styles.addLocationContainer} onPress={onGetLocation}>
            <Ionicons color={AppleColorsLight.blue}
            size={30}
            onPress={() => {
              props.navigation.goBack();
            }}
            name="navigate"/>
            <DefaultText>Add your location.</DefaultText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  screenContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addLocationContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  }
};
export { LocationPicker };

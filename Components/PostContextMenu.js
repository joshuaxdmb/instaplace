import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { Ionicons } from "@expo/vector-icons";
import { AppleColorsLight, defaultColors } from "../Constants/Colors";
import { DefaultText } from "./DefaultText";
import { TouchableOpacity } from "react-native-gesture-handler";

const numRows = 1

const PostContextMenu = (props) => {
  const { onDelete } = props;
  const [menuShown, setMenuShown] = useState(false);

  return (
    <View style={styles.container}>
      {menuShown ? (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.row} onPress={onDelete}>
            <DefaultText>Delete Post</DefaultText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.menuEmptySpace} />
      )}
      <TouchableOpacity style={styles.trigger} onPress={()=>setMenuShown(!menuShown)}>
        <Ionicons name="ellipsis-horizontal" color={"white"} size={32} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    justifyContent:'flex-end',
    width:150
  },
  row: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 150,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius:5,
    backgroundColor:AppleColorsLight.red
  },
  optionsContainer: {
    marginBottom: 5,
    backgroundColor: defaultColors.background,
    borderRadius: 5,
    height: 30*numRows,
  },
  menuEmptySpace: {
    height: 30*numRows,
    marginBottom: 5,
  },
  trigger: {
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: defaultColors.background,
    height:30,
    width:150
  },
};

export { PostContextMenu };

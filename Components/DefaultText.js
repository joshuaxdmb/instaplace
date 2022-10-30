import React from "react";
import { Text } from "react-native";
import { defaultColors } from "../Constants/Colors";



const DefaultText = (props) => {
  const { text } = props;

  return (
        <Text style={{...styles.text, ...props.style}}>
          {text}{props.children}
        </Text>
  );
};


styles = {
    text:{
        color: defaultColors.text
    }
}
export { DefaultText };

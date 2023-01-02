import React from 'react'
import {StyleSheet,View,Button} from 'react-native'
import { AppleColorsDark, AppleColorsLight } from '../Constants/Colors'

const StyledButton = props =>{
    return(
        <View  style={{...styles.buttonContainer,backgroundColor:props.color,...props.style}}>
            <Button testID = {props.testID} color='white' title={props.title} onPress={props.onPress} disabled={props.disabled}/>
        </View>
    )
}

const styles = {
    buttonContainer:{
        borderRadius:25,
        margin:2,
        width:100,
    }
}

export default StyledButton
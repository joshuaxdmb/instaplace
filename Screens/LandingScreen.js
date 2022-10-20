/* Allows the user to select whether to login or register */


//Imports
import React from 'react'
import {View} from 'react-native'
import StyledButton from '../Components/StyledButton'
import {Colors,AppleColorsLight as AppleColors} from '../Constants/Colors'

const LandingScreen = props =>{
    return(
        <View style={styles.mainview}>
            <StyledButton title="Register"
                onPress={()=>{
                    props.navigation.navigate('Register')
                }}
                color={Colors.indigo}
            />
            <StyledButton title="Login"
                onPress={()=>{
                    props.navigation.navigate('Login')
                }}
                color={AppleColors.blue}
            />
        </View>
    )
}

const styles = {
    mainview:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
}

export default LandingScreen
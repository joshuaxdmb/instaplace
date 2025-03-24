import React from 'react'
import {View, StatusBar} from 'react-native'
import StyledButton from '../Components/StyledButton'
import {Colors,AppleColorsLight as AppleColors, defaultColors} from '../Constants/Colors'

const LandingScreen = props =>{
    return(
        <View style={styles.mainview}>
        <StatusBar  barStyle="light-content" translucent={true} />
            <StyledButton title="Register"
                onPress={()=>{
                    props.navigation.navigate('Register')
                }}
                color={Colors.indigo}
                style={{width:150, marginBottom:5}}
            />
            <StyledButton title="Login"
                onPress={()=>{
                    props.navigation.navigate('Login')
                }}
                color={AppleColors.blue}
                style={{width:150, marginTop:5}}
            />
        </View>
    )
}

const styles = {
    mainview:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:defaultColors.background
    }
}

export default LandingScreen
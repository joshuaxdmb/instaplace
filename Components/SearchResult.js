
import React from 'react';
import {View,Text,TouchableOpacity,Button, Dimensions} from 'react-native'

const windowWidth = Dimensions.get('window').width;

const SearchResult = props =>{
    const {name,email} = props.data



    return(
        <TouchableOpacity
         onPress={props.onSelect}>
            <View style={styles.mainContainer}>
            <Text>{name},{email}</Text>
        </View>
        </TouchableOpacity>
        
)
}

const styles = {
    mainContainer:{
        backgroundColor:'white', 
        flex:1, 
        flexDirection:'column', 
        justifyContent:'space-between',
        alignItems:'center', 
        padding:15,
        width: windowWidth,
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        height:50

    }
}

export {SearchResult}
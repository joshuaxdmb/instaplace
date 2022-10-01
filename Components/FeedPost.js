
import React from 'react';
import {View,Text,Image,Button, Dimensions} from 'react-native'

const windowWidth = Dimensions.get('window').width;

const FeedPost = props =>{
    const {post,id} = props
    const {caption,imageUrl} = post

    return(
        <View style={styles.mainContainer}>
            <Image source={{ url: imageUrl }} style={styles.image} />
            <View style={styles.captionContainer}>
                <Text>{caption}</Text>
            </View>
        </View>
)
}

const styles = {
    mainContainer:{
        backgroundColor:'white', 
        flex:1, 
        flexDirection:'column', 
        justifyContent:'space-between',
        alignItems:'center', 
        padding:20,
        width: windowWidth,
        borderBottomColor:'#ccc',
        borderBottomWidth:1,

    },
    captionContainer:{
        justifyContent:'start',
        alignItems:'start',
        width:"100%"
    },
    image:{
        flex:1,
        height:300,
        width:'100%',
        resizeMode:'cover',
    }
}

export {FeedPost}
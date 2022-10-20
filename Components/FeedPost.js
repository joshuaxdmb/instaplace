
import React, {useState,useEffect} from 'react';
import {View,Text,Image,Button, Dimensions, TouchableOpacity} from 'react-native'
import {getAuth} from 'firebase/auth'
import { db } from '../App';
import {doc, setDoc, getDoc} from 'firebase/firestore'


const windowWidth = Dimensions.get('window').width;

const FeedPost = props =>{

    const [postUsername, setPostUsername] = useState("");

    const {post,id,uid, navigation} = props
    const {caption,imageUrl,user,comments} = post


    const onTouch = () =>{
        navigation.navigate('PostScreen',{postId:id,uid,imageUrl,caption,comments})
    }

    const getUsername = async () => {
        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);
        setPostUsername(snap.data().name);
      };

      useEffect(() => {
        console.log('useffect feedpost')
        getUsername();
        props.navigation.setOptions({
          headerLeft: ()=>(
            <View style={{marginHorizontal:10}}>
                <Ionicons  color={'black'} size={30} onPress={()=>{props.navigation.goBack()}} name="chevron-back-outline"/>
                </View>)
        })
      }, [uid, post]);


    return(
        <TouchableOpacity onPress={onTouch}>
        <View style={styles.mainContainer}>
            <Image source={{ url: imageUrl }} style={styles.image} />
            <View style={styles.captionContainer}>
                <Text>{postUsername}: {caption}</Text>
                <TouchableOpacity onPress={onTouch}><Text>View all comments</Text></TouchableOpacity>
            </View>
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
        paddingHorizontal:20,
        paddingVertical:5,
        width: windowWidth,
        borderBottomColor:'#ccc',
        borderBottomWidth:1,

    },
    captionContainer:{
        justifyContent:'start',
        alignItems:'start',
        width:"100%",
        padding:5
    },
    image:{
        flex:1,
        height:300,
        width:'100%',
        resizeMode:'cover',
    }
}

export {FeedPost}
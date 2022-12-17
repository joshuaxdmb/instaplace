import React, {useState,useEffect} from 'react';
import {View,Image,Text,StyleSheet,Alert} from 'react-native';
import Colors from '../Constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import StyledButton from './StyledButton';


const ImgPicker = props => {
    const[pickedImage,setPickedImage] = useState(null);

    const takeImageHandler = async() =>{
        const hasPermission = await verifyPermissions();
        if(!hasPermission){
            return;
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing:true,
            aspect:[1,1],
            quality:0.5
        });
        setPickedImage(image.uri);
    };
    
    const {onImageTaken} = props;
    
    useEffect(() => {
        onImageTaken('imageUrl',pickedImage,true)
    }, [pickedImage,onImageTaken]);

    const verifyPermissions = async() =>{
        const permission_cam = await Permissions.askAsync(Permissions.CAMERA);
        const permission_lib = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)

    if(permission_cam!=="granted"){//chceck permissions
        Alert.alert('Insufficient permissions','You need to grant camera permissions to use this feature.',[
            {text:'Okay'}
        ]);
        return true
    }
    return true
}

    return (<View style={styles.ImagePicker}>
        <View style={styles.imagePreview}>
            {!pickedImage? (<Text>No Image.</Text>)
            : (<Image style={styles.image} source={{uri:pickedImage}}/>)}
        </View>
        <View style={{alignItems:'center', marginBottom:20}}>
        <StyledButton
        title="Take Image"
        color={Colors.accent}
        onPress={takeImageHandler}
        //style={{width:'80%'}}
        />
        </View>
    </View>)
}


const styles = StyleSheet.create({
    imagePicker:{
        alignItems:'center',
        marginBottom:15

    }, imagePreview:{
        //width:'100%',
        height:200,
        marginBottom:10,
        justifyContent:'center',
        alignItems:'center',
        borderColor: '#ccc',
        borderWidth:1
    }, image:{
        //width:'100%',
        //height:'100%'

    }
})

export default ImgPicker
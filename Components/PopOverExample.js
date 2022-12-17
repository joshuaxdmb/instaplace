import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
  } from 'react-native-popup-menu';
  import { Text, View, StyleSheet } from 'react-native';
  import React from 'react';
  import { Ionicons } from '@expo/vector-icons';
  
  const { Popover } = renderers
  
  const MyPopover = () => (
    <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'top' }}>
      <MenuTrigger style={styles.menuTrigger} >
      <Ionicons name="ellipsis-horizontal" color={"white"} size={32} />
      </MenuTrigger>
      <MenuOptions style={styles.menuOptions} optionsContainerStyle={{marginBottom:30, bottom:130}}>
      <View>
      <Text style={styles.contentText}>Hello world!</Text>
      </View>
       
      </MenuOptions>
    </Menu>
  )
  
  const Row = () => (
    <View style={styles.row}>
      <MyPopover />
    </View>
  )
  
  const PopoverExample = () => (
    <MenuProvider style={styles.container} customStyles={{ backdrop: styles.backdrop }}>
      <Row />
    </MenuProvider>
  );
  
  const styles = {
    container: {
      padding: 10,
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    backdrop: {
    },
    menuOptions: {
      padding: 20
    },
    menuTrigger: {
      padding: 5,
      paddingTop:50,
      backgroundColor:'red'
    },
    triggerText: {
      fontSize: 20,
    },
    contentText: {
      fontSize: 18,
    },
  }
  
  export default PopoverExample;
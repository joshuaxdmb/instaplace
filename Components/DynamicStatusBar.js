import * as React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const DynamicStatusBar = props=> {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

export { DynamicStatusBar}


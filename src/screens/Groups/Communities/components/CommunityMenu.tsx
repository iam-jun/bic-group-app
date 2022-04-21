import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Share,
  Platform,
  ScrollView,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

import {ITheme} from '~/theme/interfaces';

const communityMenuData = [{id: 1, text: '', icon: ''}];
const CommunityMenu = () => {
  return <ScrollView horizontal style={{backgroundColor: 'blue'}}></ScrollView>;
};

export default CommunityMenu;

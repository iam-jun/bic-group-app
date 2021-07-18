import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';

const Section2 = () => {
  const {spacing, colors}: ITheme = useTheme();

  return (
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 2</Text.H5>
    </View>
  );
};

export default Section2;

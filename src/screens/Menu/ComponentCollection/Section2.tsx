import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Chip from '~/beinComponents/Chip';
import {IAction} from '~/constants/commonActions';

const Section2 = () => {
  const {spacing, colors}: ITheme = useTheme();

  const _onActionPress = (action: IAction) => console.log('action:', action);

  const renderBadge = () => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          Badge
        </Text.H3>
        <Chip
          onActionPress={_onActionPress}
          style={{margin: spacing?.margin.base}}
        />
      </>
    );
  };

  return (
    <View style={{}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 2</Text.H5>
      {renderBadge()}
    </View>
  );
};

export default Section2;

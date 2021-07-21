import React, {useState} from 'react';
import {View} from 'react-native';
import Text from '~/beinComponents/Text';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Divider from '~/beinComponents/Divider';
import TextInput from '~/beinComponents/inputs/TextInput';

const Section4 = () => {
  const {spacing, colors}: ITheme = useTheme();

  const renderSection = (title: string, child: React.ReactNode) => {
    return (
      <>
        <Text.H3 style={{marginHorizontal: spacing?.margin.base}}>
          {title}
        </Text.H3>
        <Divider style={{margin: spacing?.margin.base}} />
        {child}
        <Divider
          style={{
            margin: spacing?.margin.base,
            marginBottom: spacing?.margin.big,
          }}
        />
      </>
    );
  };

  const renderTextInput = () => {
    return renderSection(
      'TextInput',
      <View style={{paddingHorizontal: spacing?.margin.base}}>
        <TextInput
          label={'Example text'}
          helperContent={'Input your password'}
        />
        <TextInput
          label={'Example text'}
          helperContent={'Input your password'}
        />
        <TextInput
          label={'Example text'}
          placeholder={'Example text'}
          value={'123456789'}
          helperContent={'Wrong email or password! '}
          helperAction={'Forgot password'}
          helperActionOnPress={() => alert('onPress forgot password')}
          error
        />
        <TextInput
          disabled
          label={'Disabled'}
          helperContent={'Input your password'}
        />
      </View>,
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text.H5 style={{margin: spacing?.margin.base}}>Section 4</Text.H5>
      {renderTextInput()}
    </View>
  );
};

export default Section4;

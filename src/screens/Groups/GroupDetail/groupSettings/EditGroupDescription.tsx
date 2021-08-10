import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import useGroups from '~/hooks/groups';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';

const EditGroupDescription = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const groupData = useGroups();
  const {groupDetail} = groupData;
  const {name, description} = groupDetail;

  const [text, setText] = useState<string>(description);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header
        title={t('settings:title_group_description')}
        buttonText={'Save'}
        onPressButton={() => alert('onPress Save')}
      />
      <Text.H6>{`Description of ${name}`}</Text.H6>
      <TextInput
        value={text}
        onChangeText={_onChangeText}
        maxLength={256}
        multiline
        style={styles.textinput}
      />
    </ScreenWrapper>
  );
};

export default EditGroupDescription;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    textinput: {},
  });
};

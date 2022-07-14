import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import i18next from 'i18next';

import TextInput from '~/beinComponents/inputs/TextInput';
import TitleComponent from '../../fragments/TitleComponent';

interface EditNameProps {
  onChangeName: (value: string) => void;
  fullname: string;
  error: boolean;
}

const EditName = ({onChangeName, fullname, error}: EditNameProps) => {
  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const styles = createStyles(theme);

  const _onChangeName = (text: string) => {
    // removed trim here to avoid issue when typing Vietnamese
    onChangeName(text);
  };

  return (
    <View>
      <TitleComponent icon="TextSize" title="settings:title_name" />
      <TextInput
        value={fullname}
        style={styles.textinput}
        testID="edit_name.text_input"
        onChangeText={_onChangeName}
        error={error}
        helperContent={
          error ? i18next.t('profile:text_name_must_not_be_empty') : undefined
        }
        activeOutlineColor={theme.colors.purple50}
        outlineColor={theme.colors.gray40}
        maxLength={100}
      />
    </View>
  );
};

export default EditName;

const createStyles = (theme: ExtendedTheme) => {
  return StyleSheet.create({
    textinput: {},
  });
};

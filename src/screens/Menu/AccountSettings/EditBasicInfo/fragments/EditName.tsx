import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';

import TextInput from '~/beinComponents/inputs/TextInput';
import TitleComponent from '../../fragments/TitleComponent';

interface EditNameProps {
  onChangeName: (value: string) => void;
  fullname: string;
  error: boolean;
}

const EditName = ({onChangeName, fullname, error}: EditNameProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);

  const _onChangeName = (text: string) => {
    // removed trim here to avoid issue when typing Vietnamese
    onChangeName(text);
  };

  return (
    <View>
      <TitleComponent icon="TextFields" title="settings:title_name" />
      <TextInput
        value={fullname}
        style={styles.textinput}
        testID="edit_name.text_input"
        onChangeText={_onChangeName}
        error={error}
        helperContent={
          error ? i18next.t('profile:text_name_must_not_be_empty') : undefined
        }
        activeOutlineColor={theme.colors.primary6}
        outlineColor={theme.colors.borderCard}
        maxLength={100}
      />
    </View>
  );
};

export default EditName;

const createStyles = (theme: ITheme) => {
  return StyleSheet.create({
    textinput: {},
  });
};

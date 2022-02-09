import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';

import TextInput from '~/beinComponents/inputs/TextInput';
import TitleComponent from '../../fragments/TitleComponent';

interface EditNameProps {
  onChangeName: (value: string) => void;
}

const EditName = ({onChangeName}: EditNameProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {myProfile} = useMenu();
  const {fullname} = myProfile;

  const [name, setName] = useState<string>(fullname);
  const [error, setError] = useState<boolean>(false);

  const onDoneEditName = () => {
    const newName = name.trim();
    setName(newName);
    if (newName) {
      onChangeName(newName);
      error && setError(false);
    } else {
      setError(true);
    }
  };

  const _onChangeName = (text: string) => {
    // removed trim here to avoid issue when typing Vietnamese
    setName(text);
  };

  return (
    <View>
      <TitleComponent icon="TextFields" title="settings:title_name" />
      <TextInput
        value={name}
        style={styles.textinput}
        testID="edit_basic_info.name"
        onChangeText={_onChangeName}
        error={error}
        helperContent={
          error ? i18next.t('profile:text_name_must_not_be_empty') : undefined
        }
        onEndEditing={onDoneEditName}
        activeOutlineColor={theme.colors.primary6}
        outlineColor={theme.colors.borderCard}
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

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import useMenu from '~/hooks/menu';

import TextInput from '~/beinComponents/inputs/TextInput';
import SettingItem from '~/screens/Menu/AccountSettings/EditBasicInfo/fragments/SettingItem';
import Button from '~/beinComponents/Button';

interface EditNameProps {
  onChangeName: (value: string) => void;
}

const EditName = ({onChangeName}: EditNameProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const {myProfile} = useMenu();
  const {fullname} = myProfile;

  const [editName, setEditName] = useState<boolean>(false);
  const [name, setName] = useState<string>(fullname);
  const [error, setError] = useState<boolean>(false);

  const onDoneEditName = () => {
    if (name) {
      onChangeName(name);
      setEditName(false);
      error && setError(false);
    } else {
      setError(true);
    }
  };

  const _onChangeName = (text: string) => {
    setName(text.trim());
  };

  const onNameEditOpen = () => setEditName(true);

  return (
    <View>
      {editName ? (
        <View style={styles.editName}>
          <TextInput
            label={i18next.t('settings:title_edit_name')}
            value={name}
            style={styles.textinput}
            onChangeText={_onChangeName}
            error={error}
            helperContent={
              error
                ? i18next.t('profile:text_name_must_not_be_empty')
                : undefined
            }
          />
          <Button.Secondary onPress={onDoneEditName} useI18n>
            common:text_done
          </Button.Secondary>
        </View>
      ) : (
        <SettingItem
          title={'settings:title_name'}
          subtitle={name || i18next.t('settings:text_not_set')}
          leftIcon={'TextFields'}
          rightIcon={'EditAlt'}
          onPress={onNameEditOpen}
        />
      )}
    </View>
  );
};

export default EditName;

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    editName: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.small,
    },
    textinput: {
      flex: 1,
      marginRight: spacing.margin.small,
    },
  });
};

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import useGroups from '~/hooks/groups';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import TextInput from '~/beinComponents/inputs/TextInput';
import groupsActions from '../../redux/actions';

const EditGroupDescription = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t, navigation} = useBaseHook();
  const dispatch = useDispatch();
  const groupData = useGroups();
  const {groupDetail} = groupData;
  const {id, description} = groupDetail.group;

  const [text, setText] = useState<string>(description);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  const onSave = () => {
    dispatch(groupsActions.editGroupDetail({id, description: text}));
    navigation.goBack();
  };

  return (
    <ScreenWrapper
      testID="EditGroupDescription"
      style={styles.container}
      isFullView>
      <Header
        title={t('settings:title_group_description')}
        buttonText={'Save'}
        onPressButton={onSave}
      />

      <View style={styles.content}>
        <Text.H6
          style={styles.textEdit}
          color={theme.colors.textPrimary}
          useI18n>
          settings:title_edit_description
        </Text.H6>
        <TextInput
          value={text}
          onChangeText={_onChangeText}
          maxLength={256}
          multiline
          minHeight={248}
        />
      </View>
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
    content: {
      marginTop: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    textEdit: {
      marginBottom: spacing.margin.small,
    },
  });
};

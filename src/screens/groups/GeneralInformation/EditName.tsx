import { ExtendedTheme, useNavigation, useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import useCommunitiesStore from '~/store/comunities';
import ICommunitiesState from '~/store/comunities/Interface';
import dimension from '~/theme/dimension';
import { fontFamilies } from '~/theme/fonts';

import spacing from '~/theme/spacing';
import groupsActions from '../../../storeRedux/groups/actions';

const EditName = (props: any) => {
  const { type = 'group', id = '', name = '' } = props?.route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const actions = useCommunitiesStore(
    (state: ICommunitiesState) => state.actions,
  );

  const [text, setText] = useState<string>(name);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  useEffect(
    () => {
      !text && setText(name);
    }, [name],
  );

  const onSave = () => {
    if (!text?.trim?.()) return;

    const data = { id, name: text?.trim() || null };
    const editFieldName = i18next.t('settings:Name');
    const callback = onNavigateBack;
    if (type === 'group') {
      dispatch(groupsActions.editGroupDetail({ data, editFieldName, callback }));
    } else {
      actions.editCommunityDetail(data, editFieldName, callback);
    }
  };

  const onNavigateBack = () => navigation.goBack();

  return (
    <ScreenWrapper
      testID="EditGroupDescription"
      style={styles.container}
      isFullView
    >
      <Header
        title={`settings:title_${type}_name`}
        titleTextProps={{ useI18n: true }}
        buttonText="common:btn_save"
        buttonProps={{
          useI18n: true,
        }}
        onPressButton={onSave}
      />

      <View style={styles.content}>
        <Text.H6 color={theme.colors.neutral80} useI18n>
          settings:title_edit_name
        </Text.H6>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textEdit}
            value={text}
            onChangeText={_onChangeText}
            maxLength={64}
            multiline
            testID={`edit_${type}_name.text`}
          />
        </View>
        <Text.BodyS color={theme.colors.gray50} useI18n>
          settings:text_name_maximum_character
        </Text.BodyS>
      </View>
    </ScreenWrapper>
  );
};

export default EditName;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      marginTop: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    textEdit: {
      minHeight: 60,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.neutral80,
    },
    inputView: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.tiny,
      borderRadius: 6,
      borderWidth: 1,
      borderBottomColor: colors.neutral80,
      padding: spacing.margin.base,
      minHeight: 60,
    },
  });
};

import { ExtendedTheme, useNavigation, useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Divider from '~/beinComponents/Divider';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import useCommunityController from '~/screens/communities/store';
import dimension from '~/theme/dimension';
import { fontFamilies } from '~/theme/fonts';

import spacing from '~/theme/spacing';
import groupsActions from '../../../storeRedux/groups/actions';

const EditDescription = (props: any) => {
  const {
    type = 'group',
    id = '',
    description = '',
  } = props?.route?.params || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const actions = useCommunityController((state) => state.actions);

  const [text, setText] = useState<string>(description);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  useEffect(
    () => {
      !text && setText(description);
    }, [description],
  );

  const onSave = () => {
    const data = { id, description: text?.trim() || null };
    const editFieldName = i18next.t('common:text_description');
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
        title="settings:title_edit_description"
        titleTextProps={{ useI18n: true }}
        buttonText="common:btn_save"
        buttonProps={{ useI18n: true }}
        onPressButton={onSave}
      />
      <Divider color={theme.colors.gray5} size={spacing.padding.large} />

      <View style={styles.content}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textEdit}
            value={text}
            onChangeText={_onChangeText}
            maxLength={255}
            multiline
            testID={`edit_${type}_description.text`}
          />
        </View>
        <Text.BodyS color={theme.colors.neutral40} useI18n>
          settings:text_description_maximum_character
        </Text.BodyS>
      </View>
    </ScreenWrapper>
  );
};

export default EditDescription;

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
      minHeight: 120,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.neutral60,
    },
    inputView: {
      marginBottom: spacing.margin.tiny,
      borderRadius: spacing.borderRadius.base,
      borderWidth: 1,
      borderColor: colors.neutral5,
      padding: spacing.margin.base,
      minHeight: 150,
    },
  });
};

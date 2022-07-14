import {useNavigation} from '@react-navigation/core';
import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import dimension from '~/theme/dimension';
import {fontFamilies} from '~/theme/fonts';

import spacing from '~/theme/spacing';
import groupsActions from '../redux/actions';

const EditDescription = (props: any) => {
  const {
    type = 'group',
    id = '',
    description = '',
  } = props?.route?.params || {};

  const theme = useTheme() as ExtendedTheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [text, setText] = useState<string>(description);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    !text && setText(description);
  }, [description]);

  const onSave = () => {
    if (type === 'group') {
      dispatch(
        groupsActions.editGroupDetail({
          data: {
            id,
            description: text?.trim() ? text?.trim() : null,
          },
          editFieldName: i18next.t('common:text_description'),
          callback: onNavigateBack,
        }),
      );
    } else {
      dispatch(
        groupsActions.editCommunityDetail({
          data: {id, description: text?.trim() ? text.trim() : null},
          editFieldName: i18next.t('common:text_description'),
          callback: onNavigateBack,
        }),
      );
    }
  };

  const onNavigateBack = () => navigation.goBack();

  return (
    <ScreenWrapper
      testID="EditGroupDescription"
      style={styles.container}
      isFullView>
      <Header
        title={`settings:title_${type}_description`}
        titleTextProps={{useI18n: true}}
        buttonText={'common:btn_save'}
        buttonProps={{
          useI18n: true,
        }}
        onPressButton={onSave}
      />

      <View style={styles.content}>
        <Text.H6 color={theme.colors.neutral80} useI18n>
          settings:title_edit_description
        </Text.H6>
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
        <Text.BodyS color={theme.colors.gray50} useI18n>
          settings:text_description_maximum_character
        </Text.BodyS>
      </View>
    </ScreenWrapper>
  );
};

export default EditDescription;

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      marginTop: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    textEdit: {
      minHeight: 224,
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
      minHeight: 224,
    },
  });
};

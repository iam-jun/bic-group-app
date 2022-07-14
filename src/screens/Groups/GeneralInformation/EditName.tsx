import {useNavigation} from '@react-navigation/core';
import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {fontFamilies} from '~/theme/fonts';
import {ITheme} from '~/theme/interfaces';
import groupsActions from '../redux/actions';

const EditName = (props: any) => {
  const {type = 'group', id = '', name = ''} = props?.route?.params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [text, setText] = useState<string>(name);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    !text && setText(name);
  }, [name]);

  const onSave = () => {
    if (!text?.trim?.()) return;
    if (type === 'group') {
      dispatch(
        groupsActions.editGroupDetail({
          data: {
            id,
            name: text.trim(),
          },
          editFieldName: i18next.t('settings:Name'),
          callback: onNavigateBack,
        }),
      );
    } else {
      dispatch(
        groupsActions.editCommunityDetail({
          data: {id, name: text.trim()},
          editFieldName: i18next.t('settings:Name'),
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
        title={`settings:title_${type}_name`}
        titleTextProps={{useI18n: true}}
        buttonText={'common:btn_save'}
        buttonProps={{
          useI18n: true,
        }}
        onPressButton={onSave}
      />

      <View style={styles.content}>
        <Text.H6 color={theme.colors.textPrimary} useI18n>
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
        <Text.BodyS color={theme.colors.textSecondary} useI18n>
          settings:text_name_maximum_character
        </Text.BodyS>
      </View>
    </ScreenWrapper>
  );
};

export default EditName;

const themeStyles = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;

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
      color: colors.textPrimary,
    },
    inputView: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.tiny,
      borderRadius: 6,
      borderWidth: 1,
      borderBottomColor: colors.textPrimary,
      padding: spacing.margin.base,
      minHeight: 60,
    },
  });
};

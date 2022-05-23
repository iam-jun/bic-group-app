import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import groupsActions from '../../redux/actions';
import {fontFamilies} from '~/theme/fonts';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';

const EditGroupDescription = (props: any) => {
  const params = props.route.params;
  const {groupId} = params || {};

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {id, description} =
    useKeySelector(groupsKeySelector.groupDetail.group) || {};
  const navigation = useNavigation();

  const [text, setText] = useState<string>(description);
  const _onChangeText = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    // in case for refreshing page on web
    Platform.OS === 'web' && dispatch(groupsActions.getGroupDetail(groupId));
  }, [groupId]);

  useEffect(() => {
    !text && setText(description);
  }, [description]);

  const onSave = () => {
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
  };

  const onNavigateBack = () => navigation.goBack();

  return (
    <ScreenWrapper
      testID="EditGroupDescription"
      style={styles.container}
      isFullView>
      <Header
        title={'settings:title_group_description'}
        titleTextProps={{useI18n: true}}
        buttonText={'common:btn_save'}
        buttonProps={{
          useI18n: true,
        }}
        onPressButton={onSave}
        hideBackOnLaptop={navigation.canGoBack() ? false : true}
      />

      <View style={styles.content}>
        <Text.H6 color={theme.colors.textPrimary} useI18n>
          settings:title_edit_description
        </Text.H6>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textEdit}
            value={text}
            onChangeText={_onChangeText}
            maxLength={500}
            multiline
            testID="edit_group_description.text"
          />
        </View>
        <Text.BodyS color={theme.colors.textSecondary} useI18n>
          settings:text_maximum_character
        </Text.BodyS>
      </View>
    </ScreenWrapper>
  );
};

export default EditGroupDescription;

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
      minHeight: 224,
      fontFamily: fontFamilies.OpenSans,
      fontSize: dimension.sizes.body,
      color: colors.textPrimary,
    },
    inputView: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.tiny,
      borderRadius: 6,
      borderWidth: 1,
      borderBottomColor: colors.textPrimary,
      padding: spacing.margin.base,
      minHeight: 224,
    },
  });
};

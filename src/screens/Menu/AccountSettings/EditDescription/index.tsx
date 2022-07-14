import React, {useState} from 'react';
import i18next from 'i18next';
import {Keyboard, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import menuActions from '../../redux/actions';
import menuKeySelector from '../../redux/keySelector';
import {useKeySelector} from '~/hooks/selector';
import {fontFamilies} from '~/theme/fonts';

const EditDescription = () => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {id, description} = myProfileData;

  const [descriptionText, setDescription] = useState<string>(description);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const onSave = () => {
    dispatch(
      menuActions.editMyProfile(
        {
          id,
          description:
            descriptionText?.trim?.()?.length > 0 ? descriptionText : '',
        },
        '',
        () => {
          navigateBack();
        },
      ),
    );
  };

  const onFocusDescription = () => {
    setIsFocus(true);
  };

  const onBlurDescription = () => {
    setIsFocus(false);
  };

  const onChangeDescription = (text: string) => {
    setDescription(text);
  };

  const checkIsValid = (descriptionText: string) => {
    return description !== descriptionText;
  };

  const isValid = checkIsValid(descriptionText);

  return (
    <ScreenWrapper isFullView>
      <Header
        title={'settings:title_edit_description'}
        titleTextProps={{useI18n: true}}
        buttonText={'common:text_save'}
        buttonProps={{
          useI18n: true,
          color: theme.colors.primary6,
          textColor: theme.colors.background,
          borderRadius: theme.spacing.borderRadius.small,
          disabled: !isValid,
          testID: 'edit_description.save',
        }}
        onPressButton={onSave}
        onPressBack={navigateBack}
      />
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Text.H5 color={colors.iconTint} variant="bodyM" useI18n>
          settings:text_description
        </Text.H5>
        <View
          style={[styles.textInputView, isFocus ? styles.textInputFocus : {}]}>
          <TextInput
            value={descriptionText || ''}
            maxLength={250}
            testID="edit_description"
            placeholder={i18next.t('common:text_not_set')}
            onChangeText={onChangeDescription}
            style={styles.textInput}
            multiline={true}
            textAlignVertical="top"
            onFocus={onFocusDescription}
            onBlur={onBlurDescription}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default EditDescription;

const createStyles = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;

  return StyleSheet.create({
    container: {
      padding: spacing.margin.large,
    },
    textInput: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.textPrimary,
      flex: 1,
    },
    textInputView: {
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.borderCard,
      borderWidth: 1,
      padding: spacing.margin.base,
      marginTop: spacing.margin.small,
      height: 88,
    },
    textInputFocus: {
      borderColor: colors.primary6,
    },
  });
};

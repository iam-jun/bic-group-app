import React, {useState, memo} from 'react';
import i18next from 'i18next';
import {Keyboard, Platform, ScrollView, StyleSheet} from 'react-native';
import {useTheme, TextInput as TextInputPaper} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import TextInputBein from '~/beinComponents/inputs/TextInput';
import Text from '~/beinComponents/Text';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import menuActions from '../../redux/actions';
import menuKeySelector from '../../redux/keySelector';
import {useKeySelector} from '~/hooks/selector';

const EditDescription = () => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {id, description} = myProfileData;

  const [descriptionText, setDescription] = useState<string>(description);

  const resetData = () => {
    setDescription(description);
  };

  const navigateBack = () => {
    Keyboard.dismiss();
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const onSave = () => {
    if (descriptionText?.trim?.()?.length > 0) {
      dispatch(
        menuActions.editMyProfile({
          id,
          description: descriptionText,
        }),
      );
    }
    navigateBack();
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
        }}
        onPressButton={onSave}
        onPressBack={() => {
          resetData();
          navigateBack();
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <Text.H5 color={colors.iconTint} variant="body" useI18n>
          settings:text_description
        </Text.H5>
        <TextInputBein
          value={descriptionText || i18next.t('common:text_not_set')}
          maxLength={200}
          testID="add_work.description"
          placeholder={i18next.t('settings:text_description_optional')}
          onChangeText={onChangeDescription}
          textAlignVertical="top"
          outlineColor={colors.borderCard}
          activeOutlineColor={colors.primary6}
          multiline={true}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const EditDescriptionMemo = memo(EditDescription);
EditDescriptionMemo.whyDidYouRender = true;
export default EditDescription;

const createStyles = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;

  return StyleSheet.create({
    container: {
      padding: spacing.margin.large,
    },
  });
};

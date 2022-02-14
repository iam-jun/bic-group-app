import React, {useState, useEffect} from 'react';
import i18next from 'i18next';
import {View, StyleSheet} from 'react-native';
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
import useMenu from '~/hooks/menu';

const EditDescription = () => {
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const {myProfile} = useMenu();
  const {id, description} = myProfile;

  const [descriptionText, setDescription] = useState<string>(description);

  const navigateBack = () => {
    if (rootNavigation.canGoBack) {
      rootNavigation.goBack();
    } else {
      rootNavigation.replace(mainStack.userEdit);
    }
  };

  const onSave = () => {
    if (descriptionText.trim()?.length > 0) {
      dispatch(
        menuActions.editMyProfile({
          id,
          description,
        }),
      );
    }
    navigateBack();
  };

  const onChangeDescription = (text: string) => {
    setDescription(text);
  };

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
        }}
        onPressButton={onSave}
      />
      <View style={styles.container}>
        <Text.H5 color={colors.iconTint} variant="body" useI18n>
          settings:text_description
        </Text.H5>
        <TextInputBein
          value={description || i18next.t('common:text_not_set')}
          maxLength={200}
          testID="add_work.description"
          placeholder={i18next.t('settings:text_description_optional')}
          onChangeText={onChangeDescription}
          multiline={true}
          textAlignVertical="top"
          outlineColor={colors.borderCard}
          activeOutlineColor={colors.primary6}
        />
      </View>
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
  });
};

import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import modalActions from '~/storeRedux/modal/actions';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';

const MenuShortcut = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const onPressCreatePost = () => {
    rootNavigation.navigate(
      homeStack.postSelectAudience, { isFirstStep: true },
    );
  };

  const onPressDraft = () => {
    rootNavigation.navigate(menuStack.draft);
  };

  const onPressSavedItems = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressMedia = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderButton = (icon, name, onPress) => (
    <Button style={styles.button} onPress={onPress}>
      <View>
        <Icon size={18} tintColor={theme.colors.neutral20} icon={icon} />
        <Text.SubtitleM style={styles.buttonText}>{name}</Text.SubtitleM>
      </View>
    </Button>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        {renderButton('PenLineSolid', t('menu:title_create_post'), onPressCreatePost)}
        {renderButton('FloppyDiskPenSolid', t('menu:title_draft'), onPressDraft)}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {renderButton('BookmarkSolid', t('menu:title_saved_items'), onPressSavedItems)}
        {renderButton('PhotoFilmSolid', t('menu:title_media'), onPressMedia)}
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      padding: spacing.padding.small,
      backgroundColor: colors.neutral2,
    },
    button: {
      flex: 1,
      alignItems: 'flex-start',
      backgroundColor: colors.neutral,
      margin: spacing.margin.small,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      borderRadius: spacing.borderRadius.large,
    },
    buttonText: {
      color: colors.neutral40,
      marginTop: spacing.margin.small,
    },
  });
};

export default MenuShortcut;

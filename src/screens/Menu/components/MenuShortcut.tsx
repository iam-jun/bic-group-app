import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';

const MenuShortcut = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const onPressCreatePost = () => {
    rootNavigation.navigate(
      homeStack.postSelectAudience, { isFirstStep: true },
    );
  };

  const onPressWriteArticle = () => {
    rootNavigation.navigate(articleStack.createArticle, { isFirstStep: true });
  };

  const onPressWriteSeries = () => {
    rootNavigation.navigate(seriesStack.seriesSelectAudience, { isFirstStep: true });
  };

  const onPressYourContent = () => {
    rootNavigation.navigate(menuStack.yourContent);
  };

  const renderButton = (icon, name, onPress) => (
    <Button testID="menu_shortcut.item" style={styles.button} onPress={onPress}>
      <View>
        <Icon size={18} tintColor={theme.colors.neutral20} icon={icon} />
        <Text.SubtitleM
          testID="menu_shortcut.item.text"
          style={styles.buttonText}
        >
          {name}

        </Text.SubtitleM>
      </View>
    </Button>
  );

  return (
    <View style={styles.container} testID="menu_shortcut">
      <View style={styles.directionRow}>
        {renderButton('PenLineSolid', t('menu:title_write_post'), onPressCreatePost)}
        {renderButton('FilePenSolid', t('menu:title_write_article'), onPressWriteArticle)}
      </View>
      <View style={styles.directionRow}>
        {renderButton('AlbumCollectionSolid', t('menu:title_write_series'), onPressWriteSeries)}
        {renderButton('BallotCheckSolid', t('menu:title_your_content'), onPressYourContent)}
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
    directionRow: {
      flexDirection: 'row',
    },
  });
};

export default MenuShortcut;

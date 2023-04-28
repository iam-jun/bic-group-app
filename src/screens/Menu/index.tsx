import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import { useUserIdAuth } from '~/hooks/auth';

import spacing from '~/theme/spacing';
import MenuHeader from '~/screens/Menu/components/MenuHeader';
import MenuDiscoverCommunity from '~/screens/Menu/components/MenuDiscoverCommunity';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import MenuShortcut from '~/screens/Menu/components/MenuShortcut';
import MenuSettings from '~/screens/Menu/components/MenuSettings';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import useMenuController from './store';
import useCommonController from '../store';
import Tooltip from '../../components/Tooltip.tsx';

const screenId = 'menu';

const Menu = (): React.ReactElement => {
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const currentUserId = useUserIdAuth();
  const actions = useCommonController((state) => state.actions);

  const getJoinedCommunities = useMenuController((state) => state.actions.getJoinedCommunities);
  const loading = useMenuController((state) => state.loading);

  useEffect(
    () => {
      if (currentUserId) actions.getMyProfile({ userId: currentUserId });
    }, [],
  );

  const onRefresh = () => {
    getJoinedCommunities();
  };

  return (
    <ScreenWrapper testID="MenuScreen" style={styles.container} isFullView>
      <MenuHeader screenId={screenId} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={!!loading}
            onRefresh={onRefresh}
            tintColor={colors.gray40}
          />
        )}
      >
        <MenuDiscoverCommunity />
        <Button
          testID="menu_screen.button_discover"
          style={styles.buttonDiscover}
          onPress={() => rootNavigation.navigate(menuStack.discover)}
        >
          <Icon icon="CompassSolid" tintColor={colors.neutral20} />
          <Text.BodyMMedium style={styles.textDiscover} useI18n>menu:title_discover</Text.BodyMMedium>
        </Button>
        <MenuShortcut />
        <MenuSettings />
      </ScrollView>
      <Tooltip isDown screenId={screenId} />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    header: {
      marginTop: spacing.margin.large,
    },
    divider: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    buttonDiscover: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      marginBottom: spacing.margin.small,
      alignItems: 'center',
      backgroundColor: colors.neutral,
    },
    textDiscover: { marginLeft: spacing.margin.large, color: colors.neutral70 },
  });
};

export default Menu;

import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import { useUserIdAuth } from '~/hooks/auth';

import menuActions from '~/storeRedux/menu/actions';
import spacing from '~/theme/spacing';
import MenuHeader from '~/screens/Menu/components/MenuHeader';
import MenuDiscoverCommunity from '~/screens/Menu/components/MenuDiscoverCommunity';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import MenuShortcut from '~/screens/Menu/components/MenuShortcut';
import MenuSettings from '~/screens/Menu/components/MenuSettings';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import useJoinedCommunitiesStore from './store';

const Menu = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme;

  const currentUserId = useUserIdAuth();

  const getJoinedCommunities = useJoinedCommunitiesStore((state) => state.getJoinedCommunities);
  const loading = useJoinedCommunitiesStore((state) => state.loading);

  useEffect(
    () => {
      if (currentUserId) dispatch(menuActions.getMyProfile({ userId: currentUserId }));
    }, [],
  );

  const onRefresh = () => {
    getJoinedCommunities();
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <MenuHeader />
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
        <Button style={styles.buttonDiscover} onPress={() => rootNavigation.navigate(menuStack.discover)}>
          <Icon icon="CompassSolid" tintColor={colors.neutral20} />
          <Text.BodyMMedium style={styles.textDiscover} useI18n>menu:title_discover</Text.BodyMMedium>
        </Button>
        <MenuShortcut />
        <MenuSettings />
      </ScrollView>
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

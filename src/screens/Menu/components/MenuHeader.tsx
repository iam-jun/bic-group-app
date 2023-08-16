import React from 'react';
import {
  View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Avatar from '~/baseComponents/Avatar';
import mainStack from '~/router/navigator/MainStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import useCommonController from '~/screens/store';
import InlineText from './InlineText';
import UserBadge from '../UserProfile/components/UserBadge';

const PADDING_INFO = spacing.padding.large * 2 + dimension.avatarSizes.large;

const MenuHeader = () => {
  const theme: ExtendedTheme = useTheme();

  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const {
    id, fullname, avatar, username, isVerified = true, showingBadges = [],
  } = useCommonController((state) => state.myProfile) || {};

  const goToProfile = (targetIndex = 0) => {
    rootNavigation.navigate(
      mainStack.userProfile, { userId: id, targetIndex },
    );
  };

  return (
    <View style={styles.container} testID="menu_header">
      <View style={styles.statusBar} />
      <View style={styles.infoContainer}>
        <TouchableOpacity
          testID="menu_header.full_name"
          activeOpacity={1}
          style={styles.nameContainer}
          onPress={() => goToProfile()}
        >
          <InlineText
            testID="menu_header.full_name.text"
            text={fullname}
            isVerified={isVerified}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="menu_header.user_name"
          activeOpacity={1}
          style={styles.usernameContainer}
          onPress={() => goToProfile()}
        >
          <Text.BodyS
            testID="menu_header.user_name.text"
            color={colors.neutral40}
          >
            @
            {username}
          </Text.BodyS>
          <UserBadge
            isInMenuTab
            isCurrentUser
            showingBadges={showingBadges}
            style={styles.userBadge}
            onPress={() => goToProfile(2)}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        testID="menu_header.avatar"
        activeOpacity={1}
        style={[styles.avatar, { bottom: Boolean(showingBadges?.[0]) ? 40 : 0 }]}
        onPress={() => goToProfile()}
      >
        <Avatar.Large source={avatar} isRounded showBorder borderWidth={2} />
      </TouchableOpacity>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
      paddingBottom: 10,
    },
    statusBar: {
      height: insets.top,
      backgroundColor: colors.purple40,
    },
    infoContainer: {
    },
    nameContainer: {
      paddingTop: spacing.padding.extraLarge,
      paddingRight: spacing.padding.extraLarge,
      paddingBottom: 2,
      paddingLeft: PADDING_INFO,
      backgroundColor: colors.purple40,
      flexDirection: 'row',
      alignItems: 'center',
    },
    usernameContainer: {
      paddingTop: 2,
      paddingRight: spacing.padding.large,
      paddingLeft: PADDING_INFO,
      backgroundColor: colors.neutral,
    },
    avatar: {
      position: 'absolute',
      bottom: 0,
      left: spacing.margin.large,
    },
    userBadge: {
      paddingTop: spacing.padding.small,
    },
  });
};

export default MenuHeader;

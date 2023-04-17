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
import Icon from '~/baseComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const PADDING_INFO = spacing.padding.large * 2 + dimension.avatarSizes.large;

const MenuHeader = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const {
    id, fullname, avatar, username,
  } = useCommonController((state) => state.myProfile) || {};

  const goToProfile = () => {
    rootNavigation.navigate(
      mainStack.userProfile, { userId: id },
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
          onPress={goToProfile}
        >
          <Text.H5
            testID="menu_header.full_name.text"
            color={colors.neutral}
          >
            {fullname}
          </Text.H5>
          <ViewSpacing width={spacing.margin.xSmall} />
          <Icon
            testID="avatar.badge"
            // style={[styles.badge, styles.iconBadge]}
            size={14}
            tintColor={colors.green50}
            icon="BadgeCheck"
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="menu_header.user_name"
          activeOpacity={1}
          style={styles.usernameContainer}
          onPress={goToProfile}
        >
          <Text.BodyS
            testID="menu_header.user_name.text"
            color={colors.neutral40}
          >
            @
            {username}
          </Text.BodyS>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        testID="menu_header.avatar"
        activeOpacity={1}
        style={styles.avatar}
        onPress={goToProfile}
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
      paddingRight: spacing.padding.large,
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
  });
};

export default MenuHeader;

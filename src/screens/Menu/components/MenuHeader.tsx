import React from 'react';
import {
  View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import dimension from '~/theme/dimension';
import Avatar from '~/baseComponents/Avatar';
import mainStack from '~/router/navigator/MainStack/stack';
import { useRootNavigation } from '~/hooks/navigation';

const PADDING_INFO = spacing.padding.large * 2 + dimension.avatarSizes.large

const MenuHeader = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const {
    id, fullname, avatar, username,
  } = useKeySelector(menuKeySelector.myProfile) || {};

  const goToProfile = () => {
    rootNavigation.navigate(
      mainStack.userProfile, { userId: id },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.infoContainer}>
        <TouchableOpacity activeOpacity={1} style={styles.nameContainer} onPress={goToProfile}>
          <Text.H5 color={colors.neutral}>{fullname}</Text.H5>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={styles.usernameContainer} onPress={goToProfile}>
          <Text.BodyS color={colors.neutral40}>
            @
            {username}
          </Text.BodyS>
        </TouchableOpacity>
      </View>
      <TouchableOpacity activeOpacity={1} style={styles.avatar} onPress={goToProfile}>
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

import React, { useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Platform,
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
import useTooltip from '../../../components/Tooltip.tsx/stores';

const PADDING_INFO = spacing.padding.large * 2 + dimension.avatarSizes.large;
const ICON_SIZE = 14;

const MenuHeader = ({ screenId }:{screenId: string}) => {
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();

  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();

  const tooltipActions = useTooltip((state) => state.actions);

  const {
    id, fullname, avatar, username, isVerified = true,
  } = useCommonController((state) => state.myProfile) || {};

  useEffect(() => {
    tooltipActions.setUpScreenTooltip(screenId);
  }, [screenId]);

  const goToProfile = () => {
    rootNavigation.navigate(
      mainStack.userProfile, { userId: id },
    );
  };

  const handleLayout = (e: any) => {
    const newY = Platform.OS === 'ios'
      ? (insets.bottom > 0 ? e.nativeEvent.layout.y + ICON_SIZE
        : e.nativeEvent.layout.y - e.nativeEvent.layout.height + spacing.margin.xSmall)
      : e.nativeEvent.layout.y - spacing.margin.xSmall;
    tooltipActions.setViewPosition(screenId, {
      y: newY || 0,
    });
  };

  return (
    <View style={styles.container} testID="menu_header">
      <View style={styles.statusBar} />
      <View
        style={styles.infoContainer}
      >
        <TouchableOpacity
          testID="menu_header.full_name"
          activeOpacity={1}
          style={styles.nameContainer}
          onPress={goToProfile}
        >
          <InlineText
            testID="menu_header.full_name.text"
            screenId={screenId}
            text={fullname}
            isVerified={isVerified}
          />
        </TouchableOpacity>
        <TouchableOpacity
          testID="menu_header.user_name"
          activeOpacity={1}
          style={styles.usernameContainer}
          onPress={goToProfile}
          onLayout={handleLayout}
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

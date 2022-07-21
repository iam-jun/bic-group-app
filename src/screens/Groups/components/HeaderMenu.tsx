import {
  View, StyleProp, ViewStyle, StyleSheet,
} from 'react-native';
import React from 'react';
import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import modalActions from '~/store/modal/actions';
import spacing from '~/theme/spacing';

interface HeaderMenuProps {
  type: 'community' | 'group';
  isMember: boolean;
  canSetting: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onPressAdminTools?: () => void;
  onPressCopyLink?: () => void;
  onPressShare?: () => void;
  onPressFollowing?: () => void;
  onPressPin?: () => void;
  onPressNotification?: () => void;
  onPressLeave?: () => void;
}

const HeaderMenu = ({
  type,
  isMember,
  canSetting,
  containerStyle,
  onPressAdminTools,
  onPressCopyLink,
  onPressShare,
  onPressFollowing,
  onPressPin,
  onPressNotification,
  onPressLeave,
}: HeaderMenuProps) => {
  const theme: ExtendedTheme = useTheme();
  const dispatch = useDispatch();

  const onPressNewFeature = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  return (
    <View style={containerStyle}>
      {canSetting && (
        <PrimaryItem
          testID="header_menu.admin_tools"
          height={48}
          leftIconProps={{
            icon: 'iconShieldStar',
            size: 24,
            tintColor: theme.colors.purple50,
            style: styles.iconLeftStyle,
          }}
          leftIcon="iconShieldStar"
          title={i18next.t('groups:group_menu:label_admin_tools')}
          onPress={onPressAdminTools || onPressNewFeature}
          RightComponent={(
            <Icon
              icon="ArrowRight"
              size={12}
              tintColor={theme.colors.gray50}
            />
          )}
        />
      )}
      <PrimaryItem
        testID="header_menu.copy_link"
        height={48}
        leftIconProps={{
          icon: 'Copy',
          size: 24,
          tintColor: theme.colors.purple50,
          style: styles.iconLeftStyle,
        }}
        leftIcon="Link"
        title={i18next.t('groups:group_menu:label_copy_group_link')}
        onPress={onPressCopyLink || onPressNewFeature}
      />
      <PrimaryItem
        testID={`header_menu.share_${type}`}
        height={48}
        leftIconProps={{
          icon: 'ShareNodes',
          size: 24,
          tintColor: theme.colors.purple50,
          style: styles.iconLeftStyle,
        }}
        leftIcon="ShareNodes"
        title={i18next.t('groups:group_menu:label_share_group')}
        onPress={onPressShare || onPressNewFeature}
      />
      <PrimaryItem
        testID="header_menu.following"
        height={48}
        leftIconProps={{
          icon: 'iconAddSquareDone',
          size: 24,
          tintColor: theme.colors.purple50,
          style: styles.iconLeftStyle,
        }}
        leftIcon="iconAddSquareDone"
        title={i18next.t('groups:group_menu:label_following')}
        onPress={onPressFollowing || onPressNewFeature}
      />
      <PrimaryItem
        testID={`header_menu.pin_${type}`}
        height={48}
        leftIconProps={{
          icon: 'iconMapPin',
          size: 24,
          tintColor: theme.colors.purple50,
          style: styles.iconLeftStyle,
        }}
        leftIcon="iconMapPin"
        title={i18next.t(`groups:group_menu:label_pin_${type}`)}
        onPress={onPressPin || onPressNewFeature}
      />
      <PrimaryItem
        testID="header_menu.notifications"
        height={48}
        leftIconProps={{
          icon: 'Bell',
          size: 24,
          tintColor: theme.colors.purple50,
          style: styles.iconLeftStyle,
        }}
        leftIcon="Bell"
        title={i18next.t('groups:group_menu:label_notifications')}
        onPress={onPressNotification || onPressNewFeature}
      />
      {isMember && (
        <PrimaryItem
          testID={`header_menu.leave_${type}`}
          height={48}
          leftIconProps={{
            icon: 'ArrowRightFromArc',
            size: 24,
            tintColor: theme.colors.red60,
            style: styles.iconLeftStyle,
          }}
          leftIcon="ArrowRightFromArc"
          title={i18next.t(`groups:group_menu:label_leave_${type}`)}
          titleProps={{ color: theme.colors.red60 }}
          onPress={onPressLeave || onPressNewFeature}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconLeftStyle: { marginRight: spacing.margin.base },
});

export default HeaderMenu;

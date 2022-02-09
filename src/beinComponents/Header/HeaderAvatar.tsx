import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import Text, {TextProps} from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import {AvatarProps} from '~/beinComponents/Avatar/AvatarComponent';
import Icon, {IconProps} from '~/beinComponents/Icon';
import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';

interface HeaderAvatarProps {
  firstLabel: string;
  iconCheckCircle?: boolean;
  iconFirstLabel?: any;
  iconFirstLabelProps?: IconProps;
  secondLabel: string;
  secondLabelProps?: TextProps;
  avatar: string;
  avatarProps?: AvatarProps;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: (...params: any) => void;
}

const HeaderAvatar = ({
  firstLabel,
  iconCheckCircle,
  iconFirstLabel,
  iconFirstLabelProps,
  secondLabel,
  secondLabelProps,
  avatar,
  avatarProps,
  containerStyle,
  onPress,
}: HeaderAvatarProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  return (
    <TouchableOpacity
      testID="header_avatar"
      disabled={!isInternetReachable}
      style={StyleSheet.flatten([styles.container, containerStyle])}
      onPress={onPress}>
      <Avatar.Large source={avatar} isRounded {...avatarProps} />
      <View style={styles.content}>
        <Text variant="h5">
          {firstLabel}
          <View>
            {iconCheckCircle && (
              <View style={styles.circle}>
                <Icon
                  icon="iconCheckCircle"
                  size={12}
                  tintColor={colors.transparent}
                />
              </View>
            )}
            {iconFirstLabel && (
              <Icon icon={iconFirstLabel} size={12} {...iconFirstLabelProps} />
            )}
          </View>
        </Text>
        {secondLabel && (
          <Text variant="headingSB" {...secondLabelProps}>
            {secondLabel}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HeaderAvatar;

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bgHover,
      borderRadius: spacing.borderRadius.small,
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.extraLarge,
      marginHorizontal: spacing.margin.large,
      padding: spacing.padding.small,
    },
    content: {flex: 1, marginLeft: spacing.margin.small},
    row: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
    circle: {
      marginLeft: spacing.margin.small,
      backgroundColor: colors.success,
      height: 20,
      width: 20,
      borderRadius: 10,
      padding: spacing.padding.tiny,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

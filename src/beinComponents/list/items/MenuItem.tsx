import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IOption} from '~/interfaces/IOption';
import Text from '~/beinComponents/Text';
import Div from '~/beinComponents/Div';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RedDot, {RedDotProps} from '~/beinComponents/Badge/RedDot';

interface MenuItemProps extends IOption {
  isActive?: boolean;
  RightComponent?: React.ReactNode | React.ReactElement;
  onPress?: () => void;
  disable?: boolean;
  redDotNumber?: number;
  redDotProps?: RedDotProps;
  badgeColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  icon,
  rightSubTitle,
  rightSubIcon,
  subTitle,
  style,
  type,
  isActive = false,
  RightComponent,
  onPress,
  disable,
  redDotNumber,
  redDotProps,
  badgeColor,
}: MenuItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  let badgeNumber;
  if (type === 'draftPost') {
    const draftPost = useKeySelector(postKeySelector.draft.posts) || [];
    badgeNumber = draftPost?.length || 0;
    if (badgeNumber > 9) {
      badgeNumber = '9+';
    }
  }

  let className = 'menu-item';
  if (isActive) className = className + ` ${className}--active`;

  if (disable) className = '';

  return (
    <TouchableOpacity disabled={disable} onPress={onPress}>
      <Div className={className}>
        {Platform.OS === 'web' && isActive && (
          <View style={styles.itemActiveIndicator} />
        )}
        <View style={[styles.container, style]}>
          {icon && <Icon icon={icon} size={24} />}
          <View style={styles.titleContainer}>
            <Text.ButtonBase useI18n>{title}</Text.ButtonBase>
            {!!subTitle && (
              <Text.Subtitle numberOfLines={2} useI18n>
                {subTitle}
              </Text.Subtitle>
            )}
          </View>
          {(redDotNumber || redDotProps) && (
            <RedDot number={redDotNumber} {...redDotProps} />
          )}
          <View style={styles.rightComponent}>
            {!!rightSubTitle && (
              <Text.BodyS color={theme.colors.iconTint} useI18n>
                {rightSubTitle}
              </Text.BodyS>
            )}
            {!!rightSubIcon && (
              <Icon icon={rightSubIcon} style={styles.rightSubIcon} />
            )}
          </View>
          {!!badgeNumber && (
            <View
              style={[
                styles.badgeNumberContainer,
                badgeColor ? {backgroundColor: badgeColor} : {},
              ]}>
              <Text.Subtitle style={styles.badgeNumber}>
                {badgeNumber}
              </Text.Subtitle>
            </View>
          )}
          {RightComponent}
        </View>
      </Div>
    </TouchableOpacity>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      borderRadius: Platform.OS === 'web' ? spacing.borderRadius.small : 0,
      alignItems: 'center',
    },
    itemActiveIndicator: {
      width: 4,
      height: 32,
      position: 'absolute',
      marginTop: 8,
      backgroundColor: colors.primary5,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    titleContainer: {
      flex: 1,
      marginLeft: spacing.margin.large,
    },
    rightComponent: {
      flexDirection: 'row',
    },
    label: {},
    rightSubIcon: {
      marginLeft: spacing.margin.base,
    },
    badgeNumberContainer: {
      minWidth: 20,
      minHeight: 20,
      backgroundColor: colors.success,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeNumber: {
      color: colors.textReversed,
      marginTop: -2,
    },
  });
};

export default MenuItem;

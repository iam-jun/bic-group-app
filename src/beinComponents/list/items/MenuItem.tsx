import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Icon from '~/beinComponents/Icon';
import {IOption} from '~/interfaces/IOption';
import Text from '~/beinComponents/Text';
import Div from '~/beinComponents/Div';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

const MenuItem: React.FC<IOption> = ({
  title,
  icon,
  rightSubTitle,
  rightSubIcon,
  subTitle,
  style,
  type,
}: IOption) => {
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

  return (
    <Div className="button">
      <View style={[styles.container, style]}>
        <Icon icon={icon} size={24} />
        <View style={styles.titleContainer}>
          <Text.ButtonBase useI18n>{title}</Text.ButtonBase>
          {!!subTitle && (
            <Text.Subtitle numberOfLines={2} useI18n>
              {subTitle}
            </Text.Subtitle>
          )}
        </View>
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
          <View style={styles.badgeNumberContainer}>
            <Text.Subtitle style={styles.badgeNumber}>
              {badgeNumber}
            </Text.Subtitle>
          </View>
        )}
      </View>
    </Div>
  );
};

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
      borderRadius: spacing.borderRadius.small,
      alignItems: 'center',
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
      backgroundColor: colors.error,
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

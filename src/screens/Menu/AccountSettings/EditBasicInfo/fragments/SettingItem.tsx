import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';

import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  rightIcon?: IconType;
  leftIcon?: IconType;
  privacyIcon?: IconType;
  onPress?: () => void;
}

const SettingItem = ({
  title,
  subtitle,
  rightIcon,
  leftIcon,
  privacyIcon,
  onPress,
}: SettingItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <TouchableOpacity onPress={onPress}>
      <PrimaryItem
        title={i18next.t(title)}
        subTitle={subtitle}
        LeftComponent={
          leftIcon ? (
            <Icon
              style={styles.leftIcon}
              icon={leftIcon}
              tintColor={theme.colors.primary7}
            />
          ) : null
        }
        RightComponent={
          <>
            {!!privacyIcon && <Icon icon={privacyIcon} />}
            {!!rightIcon && <Icon icon={rightIcon} style={styles.rightIcon} />}
          </>
        }
      />
    </TouchableOpacity>
  );
};

export default SettingItem;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    rightIcon: {
      marginLeft: spacing.margin.extraLarge,
    },
    leftIcon: {
      marginRight: spacing.margin.extraLarge,
    },
  });
};

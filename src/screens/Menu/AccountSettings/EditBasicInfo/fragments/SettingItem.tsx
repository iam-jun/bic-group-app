import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';

import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';

import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: IconType;
  privacyIcon?: IconType;
  isTouchDisabled?: boolean;
  testID?: string;
  onPress?: (...params: any) => void;
}

const SettingItem = ({
  title,
  subtitle,
  leftIcon,
  privacyIcon,
  isTouchDisabled,
  testID,
  onPress,
}: SettingItemProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <TouchableOpacity
      testID="edit_user_info.setting_item"
      onPress={onPress}
      disabled={isTouchDisabled}>
      <PrimaryItem
        testID={testID}
        title={i18next.t(title)}
        subTitle={subtitle}
        subTitleProps={{variant: 'subtitle'}}
        LeftComponent={
          leftIcon ? (
            <Icon
              testID="edit_user_info.setting_item.left_component"
              icon={leftIcon}
              size={24}
              tintColor={theme.colors.primary6}
              style={styles.leftIcon}
            />
          ) : null
        }
        RightComponent={
          <>
            {!!privacyIcon && (
              <ButtonWrapper testID="edit_user_info.setting_item.right_component">
                <Icon icon={privacyIcon} />
                <Icon icon={'AngleDown'} style={styles.rightIcon} />
              </ButtonWrapper>
            )}
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
      marginLeft: spacing.margin.small,
    },
    leftIcon: {
      marginRight: spacing.margin.base,
    },
  });
};

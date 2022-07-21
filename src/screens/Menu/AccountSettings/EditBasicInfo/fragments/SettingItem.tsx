import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';

import { IconType } from '~/resources/icons';

import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import spacing from '~/theme/spacing';

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
  const theme: ExtendedTheme = useTheme();

  return (
    <TouchableOpacity
      testID="edit_user_info.setting_item"
      onPress={onPress}
      disabled={isTouchDisabled}
    >
      <PrimaryItem
        testID={testID}
        title={i18next.t(title)}
        subTitle={subtitle}
        subTitleProps={{ variant: 'bodyS' }}
        LeftComponent={
          leftIcon ? (
            <Icon
              testID="edit_user_info.setting_item.left_component"
              icon={leftIcon}
              size={24}
              tintColor={theme.colors.purple50}
              style={styles.leftIcon}
            />
          ) : null
        }
        RightComponent={(
            !!privacyIcon && (
              <ButtonWrapper testID="edit_user_info.setting_item.right_component">
                <Icon icon={privacyIcon} />
                <Icon icon="AngleDown" style={styles.rightIcon} />
              </ButtonWrapper>
            )
        )}
      />
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  rightIcon: {
    marginLeft: spacing.margin.small,
  },
  leftIcon: {
    marginRight: spacing.margin.base,
  },
});
